export const animationStyles = `
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }
    
    @keyframes scroll-left {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    
    @keyframes scroll-right {
      0% { transform: translateX(-50%); }
      100% { transform: translateX(0); }
    }
    
    .animate-float {
      animation: float 6s ease-in-out infinite;
    }
    
    .animate-scroll-left {
      animation: scroll-left 30s linear infinite;
    }
    
    .animate-scroll-right {
      animation: scroll-right 30s linear infinite;
    }
  `;
