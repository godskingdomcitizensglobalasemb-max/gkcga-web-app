/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply antialiased text-gray-900;
  }
}

@layer components {
  .pillar-card {
    @apply relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1;
  }

  .sphere-badge {
    @apply inline-flex items-center px-3 py-1 rounded-full text-sm font-medium;
  }

  .benefit-tracker {
    @apply relative flex items-center justify-between;
  }

  .benefit-step {
    @apply flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200;
  }

  .benefit-step.completed {
    @apply bg-green-500 border-green-500 text-white;
  }

  .benefit-step.current {
    @apply border-blue-500 text-blue-500;
  }

  .benefit-step.pending {
    @apply border-gray-300 text-gray-300;
  }
}

@layer utilities {
  .animate-float {
    animation: float 3s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
}