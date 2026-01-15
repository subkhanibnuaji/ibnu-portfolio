// Personal Photos Configuration
// Ganti URL foto sesuai kebutuhan

export const personalPhotos = {
  // Foto utama untuk Hero section (foto formal/profesional)
  hero: {
    src: '/images/profile/graduation-ugm.jpg', // Foto wisuda UGM - profesional
    alt: 'Subkhan Ibnu Aji',
    caption: 'MBA Graduate - UGM',
  },

  // Foto untuk About page - Education section
  education: {
    ugm: {
      src: '/images/profile/graduation-ugm.jpg',
      alt: 'Wisuda MBA UGM',
      caption: 'MBA Graduation - Universitas Gadjah Mada 2024',
    },
    telkom: {
      src: '/images/profile/graduation-telkom.jpg', // Tambahkan foto wisuda Telkom jika ada
      alt: 'Wisuda S.Kom Telkom University',
      caption: 'Bachelor Graduation - Telkom University 2021',
    },
  },

  // Foto untuk section lain (bisa ditambahkan)
  presentations: {
    // Foto saat presentasi - cocok untuk Projects atau Experience
    main: {
      src: '/images/profile/presentation.jpg',
      alt: 'Presentasi',
      caption: 'Speaking at Tech Conference',
    },
  },

  // Foto dengan tokoh penting
  networking: {
    // Foto dengan orang-orang penting - cocok untuk Testimonials atau Gallery
    featured: [
      {
        src: '/images/profile/networking-1.jpg',
        alt: 'Networking Event',
        caption: 'Meeting with industry leaders',
      },
    ],
  },

  // Foto candid/casual untuk Blog atau Contact page
  casual: {
    src: '/images/profile/casual.jpg',
    alt: 'Ibnu',
    caption: 'Behind the scenes',
  },
}

// Helper function to get photo with fallback
export function getPhoto(category: keyof typeof personalPhotos, subKey?: string) {
  const categoryPhotos = personalPhotos[category]
  if (subKey && typeof categoryPhotos === 'object' && subKey in categoryPhotos) {
    return (categoryPhotos as Record<string, unknown>)[subKey]
  }
  return categoryPhotos
}
