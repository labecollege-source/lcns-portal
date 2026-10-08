import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db } from './config';
import { Student, PaymentRecord } from '../types/college';
import { INITIAL_STUDENTS_LIST, INITIAL_PAYMENTS } from '../data/initialData';

const STUDENTS_COLLECTION = 'students';
const PAYMENTS_COLLECTION = 'payments';

/**
 * Fetch all students from Firestore collection 'students'.
 * If the collection is empty, automatically seed with initial students.
 */
export async function fetchFirestoreStudents(): Promise<Student[]> {
  try {
    const colRef = collection(db, STUDENTS_COLLECTION);
    const snap = await getDocs(colRef);

    if (snap.empty) {
      console.log('Firestore "students" collection empty. Seeding initial students...');
      await seedInitialStudents();
      return INITIAL_STUDENTS_LIST;
    }

    const studentsList: Student[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data() as Student;
      studentsList.push({
        ...data,
        id: data.id || docSnap.id,
      });
    });

    return studentsList;
  } catch (error) {
    console.warn('Error fetching Firestore students:', error);
    return INITIAL_STUDENTS_LIST;
  }
}

/**
 * Seed initial students into Firestore collection 'students'.
 */
export async function seedInitialStudents(): Promise<void> {
  try {
    for (const student of INITIAL_STUDENTS_LIST) {
      const docRef = doc(db, STUDENTS_COLLECTION, student.id);
      await setDoc(docRef, student, { merge: true });
    }
    console.log('Successfully seeded students to Firestore');
  } catch (error) {
    console.warn('Error seeding students to Firestore:', error);
  }
}

/**
 * Save or update a single student in Firestore collection 'students'.
 */
export async function saveFirestoreStudent(student: Student): Promise<void> {
  try {
    const docRef = doc(db, STUDENTS_COLLECTION, student.id);
    await setDoc(docRef, student, { merge: true });
  } catch (error) {
    console.warn('Error saving student to Firestore:', error);
  }
}

/**
 * Delete a student from Firestore collection 'students'.
 */
export async function deleteFirestoreStudent(studentId: string): Promise<void> {
  try {
    const docRef = doc(db, STUDENTS_COLLECTION, studentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.warn('Error deleting student from Firestore:', error);
  }
}

/**
 * Fetch all payments from Firestore collection 'payments'.
 * If the collection is empty, automatically seed with initial payments.
 */
export async function fetchFirestorePayments(): Promise<PaymentRecord[]> {
  try {
    const colRef = collection(db, PAYMENTS_COLLECTION);
    const snap = await getDocs(colRef);

    if (snap.empty) {
      console.log('Firestore "payments" collection empty. Seeding initial payments...');
      await seedInitialPayments();
      return INITIAL_PAYMENTS;
    }

    const paymentsList: PaymentRecord[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data() as PaymentRecord;
      paymentsList.push({
        ...data,
        id: data.id || docSnap.id,
      });
    });

    return paymentsList;
  } catch (error) {
    console.warn('Error fetching Firestore payments:', error);
    return INITIAL_PAYMENTS;
  }
}

/**
 * Seed initial payments into Firestore collection 'payments'.
 */
export async function seedInitialPayments(): Promise<void> {
  try {
    for (const payment of INITIAL_PAYMENTS) {
      const docRef = doc(db, PAYMENTS_COLLECTION, payment.id);
      await setDoc(docRef, payment, { merge: true });
    }
    console.log('Successfully seeded payments to Firestore');
  } catch (error) {
    console.warn('Error seeding payments to Firestore:', error);
  }
}

/**
 * Save or record a payment in Firestore collection 'payments'.
 */
export async function saveFirestorePayment(payment: PaymentRecord): Promise<void> {
  try {
    const docRef = doc(db, PAYMENTS_COLLECTION, payment.id);
    await setDoc(docRef, payment, { merge: true });
  } catch (error) {
    console.warn('Error saving payment to Firestore:', error);
  }
}

/**
 * Subscribe to real-time changes on 'students' collection
 */
export function subscribeToFirestoreStudents(callback: (students: Student[]) => void): () => void {
  try {
    const colRef = collection(db, STUDENTS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Student[] = [];
          snapshot.forEach((d) => list.push({ ...(d.data() as Student), id: d.id }));
          callback(list);
        } else {
          // If empty, trigger seed and return baseline
          seedInitialStudents().then(() => callback(INITIAL_STUDENTS_LIST));
        }
      },
      (err) => {
        console.warn('Firestore students subscription error:', err);
      }
    );
  } catch (e) {
    console.warn('Could not subscribe to students:', e);
    return () => {};
  }
}

/**
 * Subscribe to real-time changes on 'payments' collection
 */
export function subscribeToFirestorePayments(callback: (payments: PaymentRecord[]) => void): () => void {
  try {
    const colRef = collection(db, PAYMENTS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: PaymentRecord[] = [];
          snapshot.forEach((d) => list.push({ ...(d.data() as PaymentRecord), id: d.id }));
          callback(list);
        } else {
          seedInitialPayments().then(() => callback(INITIAL_PAYMENTS));
        }
      },
      (err) => {
        console.warn('Firestore payments subscription error:', err);
      }
    );
  } catch (e) {
    console.warn('Could not subscribe to payments:', e);
    return () => {};
  }
}
