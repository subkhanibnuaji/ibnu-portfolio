// Personal Photos Configuration
// Ganti URL foto sesuai kebutuhan

export const personalPhotos = {
  // Foto utama untuk Hero section (foto formal/profesional)
  hero: {
    src: '/images/profile/formal-ugm.jpg', // Foto dengan jas formal di wisuda
    alt: 'Subkhan Ibnu Aji',
    caption: 'MBA Graduate - UGM',
  },

  // Foto untuk About page - Education section
  education: {
    ugm: {
      src: '/images/profile/graduation-ugm.jpg', // Foto penerimaan ijazah dari Dekan
      alt: 'Wisuda MBA UGM',
      caption: 'MBA Graduation - Universitas Gadjah Mada 2025',
    },
    telkom: {
      src: '/images/profile/graduation-telkom.jpg', // Tambahkan foto wisuda Telkom jika ada
      alt: 'Wisuda S.Kom Telkom University',
      caption: 'Bachelor Graduation - Telkom University 2021',
    },
  },

  // Foto untuk Experience/Achievements - Pitching, presentasi, dll
  achievements: {
    pitching: {
      src: '/images/profile/pitching-nicko.jpg', // Screenshot pitching dengan Nicko Widjaja
      alt: 'Pitching Session with Nicko Widjaja',
      caption: 'Startup Pitching - Nicko Widjaja (East Ventures)',
      person: 'Nicko Widjaja',
      role: 'Managing Partner, East Ventures',
    },
  },

  // Foto dengan tokoh penting - Networking Gallery
  networking: [
    {
      src: '/images/profile/with-raymond-chin.jpg',
      alt: 'With Raymond Chin',
      caption: 'Meeting with Raymond Chin',
      person: 'Raymond Chin',
      role: 'Founder, Ternak Uang',
      category: 'finance',
    },
    {
      src: '/images/profile/networking-porsche.jpg',
      alt: 'Networking Event',
      caption: 'Startup Community Meetup',
      person: '',
      role: '',
      category: 'startup',
    },
    // Tambahkan foto lain di sini
  ],

  // Foto organisasi - HIPMI, CFA, dll
  organizations: [
    {
      src: '/images/profile/hipmi-bandung.jpg',
      alt: 'HIPMI Bandung Event',
      caption: 'HIPMI Bandung Welcome Event',
      organization: 'HIPMI Bandung',
      category: 'hipmi',
    },
    {
      src: '/images/profile/hipmi-jaya.jpg',
      alt: 'HIPMI Jaya Event',
      caption: 'HIPMI Jaya Ceremony',
      organization: 'HIPMI Jaya',
      category: 'hipmi',
    },
  ],

  // Foto presentasi dan public speaking
  presentations: [
    {
      src: '/images/profile/presentation-mandiri.jpg',
      alt: 'Presentation at Bank Mandiri',
      caption: 'Presenting at Bank Mandiri',
      venue: 'Bank Mandiri',
      category: 'corporate',
    },
  ],

  // Foto casual untuk Blog atau Contact page
  casual: {
    src: '/images/profile/casual.jpg',
    alt: 'Ibnu',
    caption: 'Behind the scenes',
  },
}

// Helper function to get photo
export function getPhoto(category: keyof typeof personalPhotos, key?: string | number) {
  const photos = personalPhotos[category]
  if (Array.isArray(photos) && typeof key === 'number') {
    return photos[key]
  }
  if (typeof photos === 'object' && !Array.isArray(photos) && key && typeof key === 'string') {
    return (photos as Record<string, unknown>)[key]
  }
  return photos
}
