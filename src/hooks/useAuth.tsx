import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut,
  User as FirebaseUser 
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { User, Role } from "@/types";

interface AuthContextType {
  user: User | null;
  role: Role;
  isLoading: boolean;
  signInWithGoogle: (initialRole?: Role) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role>('PUBLIC');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user document from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setUser({ ...userData, id: firebaseUser.uid });
          setRole(userData.role);
        } else {
          // If profile doesn't exist but user is signed in, they might have closed the app during registration
          // We'll handle this by showing public view or redirecting to complete profile
          setRole('PUBLIC');
        }
      } else {
        setUser(null);
        setRole('PUBLIC');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (initialRole?: Role) => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      // Check if user exists in Firestore
      const userRef = doc(db, "users", firebaseUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        const assignedRole = initialRole || 'PUBLIC';
        const newUser: Partial<User> = {
          name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
          email: firebaseUser.email || "",
          role: assignedRole,
          emailVerified: firebaseUser.emailVerified,
          createdAt: new Date().toISOString(),
        };
        
        await setDoc(userRef, {
          ...newUser,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        
        setUser({ ...newUser, id: firebaseUser.uid } as User);
        setRole(assignedRole);
      } else {
        const existingData = userDoc.data() as User;
        setUser({ ...existingData, id: firebaseUser.uid });
        setRole(existingData.role);
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, isLoading, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
