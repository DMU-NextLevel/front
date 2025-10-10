import React from 'react';

interface DotsLoaderProps {
  className?: string;
}

const DotsLoader: React.FC<DotsLoaderProps> = ({ className = '' }) => {
  return (
    <div className={`dots-loader-container ${className}`}>
      <div className="four">
        <div className="dot d1"><div className="circle c4"></div></div>
        <div className="dot d2"><div className="circle c1"></div></div>
        <div className="dot d3"><div className="circle c2"></div></div>
        <div className="dot d4"><div className="circle c3"></div></div>
        <div className="dot d5"></div>
        <div className="dot d7"></div>
        <div className="dot d8"><div className="circle c6"></div></div>
        <div className="dot d9"></div>
        <div className="dot d10"><div className="circle c5"></div></div>
        <div className="dot d11"><div className="circle c8"></div></div>
        <div className="dot d12"><div className="circle c7"></div></div>
        <div className="dot d13"></div>
        <div className="dot d14"></div>
        <div className="dot d15"></div>
        <div className="dot d16"></div>
        <div className="dot d17"></div>
        <div className="dot d18"></div>
        <div className="dot d19"></div>
        <div className="dot d20"></div>
        <div className="dot d21"></div>
        <div className="dot d22"></div>
        <div className="dot d23"></div>
        <div className="dot d24"></div>
        <div className="dot d25"></div>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
          .dots-loader-container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
          }

          .four {
            width: 0px;
            height: 0px;
            position: relative;
            transform-origin: 0 0;
            animation: dots-sequence 3s ease-in-out infinite;
          }

          .dot {
            width: 4px;
            height: 4px;
            background: #fff;
            border-radius: 50%;
            position: absolute;
            animation: dots-fade 3s ease-in-out infinite;
          }

          .dot.d1 { left: -2px; top: -2px; animation-delay: 0s; }
          .dot.d2 { right: -2px; top: -2px; animation-delay: 0.1s; }
          .dot.d3 { left: -2px; bottom: -2px; animation-delay: 0.2s; }
          .dot.d4 { right: -2px; bottom: -2px; animation-delay: 0.3s; }
          .dot.d5 { right: -2px; bottom: -2px; animation-delay: 0.4s; }
          .dot.d7 { left: -2px; bottom: -2px; animation-delay: 0.5s; }
          .dot.d8 { right: -2px; top: -2px; animation-delay: 0.6s; }
          .dot.d9 { left: -2px; top: -2px; animation-delay: 0.7s; }
          .dot.d10 { right: -42px; bottom: -42px; width: 0; height: 0; animation-delay: 0.8s; }
          .dot.d11 { left: -52px; bottom: -2px; opacity: 0; animation-delay: 0.9s; }
          .dot.d12 { right: -52px; top: -2px; opacity: 0; animation-delay: 1.0s; }
          .dot.d13 { right: -52px; top: -2px; opacity: 0; animation-delay: 1.1s; }
          .dot.d14 { left: -2px; bottom: -52px; opacity: 0; animation-delay: 1.2s; }
          .dot.d15 { right: -2px; top: -52px; opacity: 0; animation-delay: 1.3s; }
          .dot.d16 { left: -52px; bottom: -2px; opacity: 0; animation-delay: 1.4s; }
          .dot.d17 { right: 88px; top: -44px; opacity: 0; animation-delay: 1.5s; }
          .dot.d18 { left: 47px; bottom: -51px; opacity: 0; animation-delay: 1.6s; }
          .dot.d19 { bottom: -51px; left: -2px; opacity: 0; animation-delay: 1.7s; }
          .dot.d20 { left: -51px; bottom: -2px; opacity: 0; animation-delay: 1.8s; }
          .dot.d21 { left: -52px; top: -1px; opacity: 0; animation-delay: 1.9s; }
          .dot.d22 { top: -52px; right: -2px; opacity: 0; animation-delay: 2.0s; }
          .dot.d23 { right: 48px; top: -52px; opacity: 0; animation-delay: 2.1s; }
          .dot.d24 { right: -50px; bottom: 48px; opacity: 0; animation-delay: 2.2s; }
          .dot.d25 { right: -51px; top: 47px; opacity: 0; animation-delay: 2.3s; }

          .circle {
            width: 4px;
            height: 4px;
            border: 2px solid #fff;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform-origin: 0 0;
            transform: translate(-50%, -50%);
            animation: circle-pulse 3s ease-in-out infinite;
          }

          .circle.c1 { animation-delay: 0.1s; }
          .circle.c2 { animation-delay: 0.2s; }
          .circle.c3 { animation-delay: 0.3s; }
          .circle.c4 { animation-delay: 0.4s; }
          .circle.c5 { width: 30px; height: 30px; opacity: 0; animation-delay: 0.5s; }
          .circle.c6 { animation-delay: 0.6s; }
          .circle.c7 { animation-delay: 0.7s; }
          .circle.c8 { animation-delay: 0.8s; }

          @keyframes dots-sequence {
            0% { transform: rotate(0deg) scale(0); }
            10% { transform: rotate(18deg) scale(0.2); }
            20% { transform: rotate(36deg) scale(0.4); }
            30% { transform: rotate(54deg) scale(0.6); }
            40% { transform: rotate(72deg) scale(0.8); }
            50% { transform: rotate(90deg) scale(1); }
            60% { transform: rotate(108deg) scale(1.2); }
            70% { transform: rotate(126deg) scale(1); }
            80% { transform: rotate(144deg) scale(0.8); }
            90% { transform: rotate(162deg) scale(0.4); }
            100% { transform: rotate(180deg) scale(0); }
          }

          @keyframes dots-fade {
            0%, 100% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1); }
          }

          @keyframes circle-pulse {
            0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
          }
        `
      }} />
    </div>
  );
};

export default DotsLoader;