import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";

export default function Customizer({ onBack }) {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [printZone, setPrintZone] = useState(null);

  useEffect(() => {
    // Initialize Canvas
    const initCanvas = async () => {
      // In Fabric v6/v7, we use the constructor directly if imported named,
      // but with * as fabric we can use fabric.Canvas
      const c = new fabric.Canvas(canvasRef.current, {
        width: 800,
        height: 800,
        backgroundColor: '#ffffff'
      });

      // Load background image
      const bgImg = await fabric.FabricImage.fromURL('/product_bottle.png');
      // scale background to fit canvas nicely
      bgImg.scaleToWidth(800);
      c.backgroundImage = bgImg;

      // Define Print Zone based on hypothetical customization.json values
      // For bottle: x: 300, y: 400, width: 200, height: 200
      const zone = new fabric.Rect({
        left: 300,
        top: 350,
        width: 200,
        height: 300,
        fill: 'transparent',
        stroke: '#1a7de3',
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false, // let events pass through
      });

      c.add(zone);
      c.renderAll();

      setCanvas(c);
      setPrintZone(zone);
    };

    initCanvas();

    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !canvas) return;

    const reader = new FileReader();
    reader.onload = async (f) => {
      const data = f.target.result;
      const img = await fabric.FabricImage.fromURL(data);
      
      // Scale down if it's too big
      if (img.width > 150) {
        img.scaleToWidth(150);
      }
      
      // Place it in the center of the print zone
      img.set({
        left: printZone.left + (printZone.width / 2) - (img.getScaledWidth() / 2),
        top: printZone.top + (printZone.height / 2) - (img.getScaledHeight() / 2),
        cornerColor: '#1a7de3',
        cornerStyle: 'circle',
        transparentCorners: false,
        borderColor: '#1a7de3'
      });

      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
    };
    reader.readAsDataURL(file);
  };

  const handleDelete = () => {
    if (!canvas) return;
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length) {
      activeObjects.forEach((obj) => {
        canvas.remove(obj);
      });
      canvas.discardActiveObject();
      canvas.renderAll();
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f9f9f9', fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar Controls */}
      <div style={{ width: '300px', background: '#fff', padding: '32px', borderRight: '1px solid #ebebeb', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <button 
          onClick={onBack} 
          style={{ alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#666', marginBottom: '24px' }}
        >
          ← Back to Catalog
        </button>
        
        <div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', marginBottom: '8px' }}>Customizer</h2>
          <p style={{ fontSize: '14px', color: '#666', lineHeight: '1.5' }}>Upload your logo and place it within the dashed print area.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
          <label style={{ background: '#000', color: '#fff', padding: '12px', textAlign: 'center', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
            Upload Logo
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
          </label>
          <button 
            onClick={handleDelete}
            style={{ background: '#fff', color: '#d32f2f', border: '1px solid #d32f2f', padding: '12px', borderRadius: '4px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
          >
            Delete Selected
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ boxShadow: '0 10px 40px rgba(0,0,0,0.08)', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
          <canvas ref={canvasRef} />
        </div>
      </div>
    </div>
  );
}
