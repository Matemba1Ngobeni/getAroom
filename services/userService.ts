import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import type { User, TenantUser, LandlordUser, ReviewOfLandlord, TrusteeUser } from '../types';

export const userService = {
  getUserByEmail: async (email: string): Promise<User | undefined> => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email.toLowerCase()));
    
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      return undefined;
    }
    
    const userDoc = querySnapshot.docs[0];
    return { ...userDoc.data(), id: userDoc.id } as User;
  },
  
  getTrusteeLogin: async (email: string): Promise<TrusteeUser | undefined> => {
    const lowercasedEmail = email.toLowerCase();
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("trustees", "array-contains", { email: lowercasedEmail }));
    
    const querySnapshot = await getDocs(collection(db, 'users'));
    
    for (const userDoc of querySnapshot.docs) {
        const user = userDoc.data() as User;
        if (user.userType === 'Student' || user.userType === 'General Tenant') {
            const tenant = user as TenantUser;
            const foundTrustee = tenant.trustees.find(t => t.email.toLowerCase() === lowercasedEmail);

            if (foundTrustee) {
                return {
                    id: foundTrustee.id,
                    name: foundTrustee.name,
                    email: foundTrustee.email,
                    userType: 'Trustee',
                    tenantInTrust: {
                        id: tenant.id,
                        name: tenant.name,
                        leasedRoomId: tenant.leasedRoomId,
                    },
                };
            }
        }
    }
    
    return undefined;
  },

  addReviewToLandlord: async (landlordId: string, review: ReviewOfLandlord): Promise<void> => {
    const landlordRef = doc(db, 'users', landlordId);
    const landlordSnap = await getDoc(landlordRef);

    if (landlordSnap.exists() && landlordSnap.data().userType === 'Landlord') {
        await updateDoc(landlordRef, {
            reviews: arrayUnion(review)
        });
    } else {
        console.error("Landlord not found or user is not a landlord.");
    }
  },
};
