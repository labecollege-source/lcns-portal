// Official photographic records and visual assets for Labe College of Nursing Sciences, Gboko
// Strictly using only authentic images uploaded by the institution

import schoolLogoImg from '../assets/images/school_logo_1791012211898.jpg';
import demoRoomImg from '../assets/images/demonstration_room_1791012223258.jpg';
import scienceLabImg from '../assets/images/science_laboratory_1791012233991.jpg';
import girlsHostelImg from '../assets/images/girls_hostel_1791012245638.jpg';
import governorSigningImg from '../assets/images/governor_signing_1791012258553.jpg';
import lectureHallImg from '../assets/images/lecture_hall_1791012269178.jpg';
import ictCenterImg from '../assets/images/ict_center_1791012280872.jpg';
import eLibraryImg from '../assets/images/e_library_1791012290852.jpg';
import galleryGirlsHostelsImg from '../assets/images/gallery_girls_hostels.jpg';
import galleryGovernorSigningImg from '../assets/images/gallery_governor_signing.jpg';
import galleryClassroomImg from '../assets/images/gallery_classroom.jpg';
import gallerySchoolEnvironmentImg from '../assets/images/gallery_school_environment.jpg';
import galleryIctCentreImg from '../assets/images/gallery_ict_centre.jpg';

export const SCHOOL_LOGO_IMAGE = schoolLogoImg;
export const DEMONSTRATION_ROOM_IMAGE = demoRoomImg;
export const SCIENCE_LAB_IMAGE = scienceLabImg;
export const GIRLS_HOSTEL_IMAGE = girlsHostelImg;
export const GOVERNOR_SIGNING_IMAGE = governorSigningImg;
export const LECTURE_HALL_IMAGE = lectureHallImg;
export const ICT_CENTER_IMAGE = ictCenterImg;
export const E_LIBRARY_IMAGE = eLibraryImg;
export const GALLERY_GIRLS_HOSTELS_IMAGE = galleryGirlsHostelsImg;
export const GALLERY_GOVERNOR_SIGNING_IMAGE = galleryGovernorSigningImg;
export const GALLERY_CLASSROOM_IMAGE = galleryClassroomImg;
export const GALLERY_SCHOOL_ENVIRONMENT_IMAGE = gallerySchoolEnvironmentImg;
export const GALLERY_ICT_CENTRE_IMAGE = galleryIctCentreImg;

import bishopProprietorImg from '../assets/images/bishop_proprietor.jpg';
import physicsChemLabImg from '../assets/images/physics_chemistry_lab.jpg';
import openingMassBishopImg from '../assets/images/opening_mass_bishop.jpg';
import demonstrationRoomLcnsImg from '../assets/images/demonstration_room_lcns.jpg';
import lcnsBusImg from '../assets/images/lcns_32_seater_bus.jpg';
import governorAliaSigningImg from '../assets/images/governor_alia_signing.jpg';
import provostCarImg from '../assets/images/provost_car.jpg';

export const BISHOP_PROPRIETOR_IMAGE = bishopProprietorImg;
export const PHYSICS_CHEMISTRY_LAB_IMAGE = physicsChemLabImg;
export const OPENING_MASS_BISHOP_IMAGE = openingMassBishopImg;
export const DEMONSTRATION_ROOM_LCNS_IMAGE = demonstrationRoomLcnsImg;
export const LCNS_32_SEATER_BUS_IMAGE = lcnsBusImg;
export const GOVERNOR_ALIA_SIGNING_IMAGE = governorAliaSigningImg;
export const PROVOST_CAR_IMAGE = provostCarImg;


export interface CollegePhoto {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  category: string;
  description: string;
  url: string;
  tag: string;
  badge?: string;
}

export const COLLEGE_AUTHENTIC_PHOTOS: CollegePhoto[] = [
  {
    id: 'photo-logo',
    number: 0,
    title: 'Official Crest & Coat of Arms of Labe College of Nursing Sciences',
    shortTitle: 'Official School Logo',
    category: 'Heraldry & Seal',
    description: 'Official institutional crest of Labe College of Nursing Sciences, Gboko, Catholic Diocese of Gboko.',
    url: SCHOOL_LOGO_IMAGE,
    tag: 'Official School Crest',
    badge: 'Official Seal',
  },
  {
    id: 'photo-1',
    number: 1,
    title: 'Girls Hostels & Student Residential Hall',
    shortTitle: 'Girls Hostels',
    category: 'Accommodation',
    description: 'Official photograph of the girls hostels and student residential facilities at Labe College of Nursing Sciences, Gboko.',
    url: GALLERY_GIRLS_HOSTELS_IMAGE,
    tag: 'Girls Hostels',
    badge: 'Campus Living',
  },
  {
    id: 'photo-2',
    number: 2,
    title: 'Governor Signing the Bill Establishing Labe College of Nursing Sciences',
    shortTitle: 'Governor Signing Bill',
    category: 'College Establishment',
    description: 'Historic photograph of His Excellency, Rev. Fr. Hyacinth Iormem Alia, Executive Governor of Benue State, signing the bill establishing the College.',
    url: GALLERY_GOVERNOR_SIGNING_IMAGE,
    tag: 'Governor Signing',
    badge: 'Historic Milestone',
  },
  {
    id: 'photo-3',
    number: 3,
    title: 'College Classroom',
    shortTitle: 'Classroom',
    category: 'Academic Facilities',
    description: 'Official photograph of a Labe College of Nursing Sciences classroom prepared for teaching and learning.',
    url: GALLERY_CLASSROOM_IMAGE,
    tag: 'Classroom',
    badge: 'Academic',
  },
  {
    id: 'photo-4',
    number: 4,
    title: 'College School Environment',
    shortTitle: 'School Environment',
    category: 'Campus',
    description: 'Official photograph showing the college campus environment and academic buildings.',
    url: GALLERY_SCHOOL_ENVIRONMENT_IMAGE,
    tag: 'School Environment',
    badge: 'Campus',
  },
  {
    id: 'photo-5',
    number: 5,
    title: 'ICT & Computer Centre',
    shortTitle: 'ICT Centre',
    category: 'Information Technology',
    description: 'Official photograph of the College ICT and computer centre for digital learning and CBT activities.',
    url: GALLERY_ICT_CENTRE_IMAGE,
    tag: 'ICT Centre',
    badge: 'ICT',
  },
];
