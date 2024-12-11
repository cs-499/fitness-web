//This is just the particle system, can be imported to any page by including <ParticleSys /> in the rendering
//don't forget to import ParticleSys from '../particles/particle_sys' at the top before you include
import React from "react";
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import './particle_sys.css'
export default function Particle() {

  const [init, setInit] = useState(false);
  useEffect(() => {
    console.log("init");
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
  };

  return (
    //This is the entire particle system and its settings
        <div className="background">
        
        <>
        {init && (
        <Particles
            id="tsparticles"
            particlesLoaded={particlesLoaded}
            style={{
            zIndex: 1,
            }}
            options={{
            fpsLimit: 60,
            interactivity: {
                events: {
                onClick: {
                    enable: true,
                    mode: "push",
                },
                onHover: {
                    enable: true,
                    mode: "repulse",
                },
                resize: true,
                },
                modes: {
                push: {
                    quantity: 4,
                },
                repulse: {
                    distance: 200,
                    duration: 0.4,
                },
                },
            },
            particles: {
                color: {
                value: "#000",
                },
                links: {
                color: "#000",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
                },
                move: {
                direction: "none",
                enable: true,
                outModes: {
                    default: "bounce",
                },
                random: false,
                speed: 1.2,
                straight: false,
                },
                number: {
                density: {
                    enable: true,
                    area: 800,
                },
                value: 160,
                },
                opacity: {
                value: 0.5,
                },
                shape: {
                type: "circle",
                },
                size: {
                value: { min: 1, max: 5 },
                },
            },
            detectRetina: true,
            }}
        />
        )}
        </>

        </div>
    
  );

}