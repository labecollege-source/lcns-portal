import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { app } from './config';

export const storage = getStorage(app);

export async function uploadCollegeImage(file: File, folder = 'college-media'): Promise<{ url: string; path: string }> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Only image files are allowed.');
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error('Image is larger than the 5MB limit.');
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${folder}/${Date.now()}-${safeName}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, { contentType: file.type });
  const url = await getDownloadURL(storageRef);
  return { url, path };
}

export async function removeCollegeImage(path?: string): Promise<void> {
  if (!path) return;
  try {
    await deleteObject(ref(storage, path));
  } catch (error) {
    console.warn('Storage image delete skipped:', error);
  }
}
