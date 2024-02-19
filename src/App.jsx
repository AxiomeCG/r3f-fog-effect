import { Canvas } from "@react-three/fiber";
import "./App.scss";
import { Center, Environment } from "@react-three/drei";
import { EffectComposer } from "@react-three/postprocessing";
import { GradientFog } from "./effects/GradientFogEffect";
import { useControls } from "leva";
import React from "react";
import { Maya } from "./models/Maya";

const Scene = () => {
  return <>
    <Center rotation={[0, Math.PI / 3, 0]}>
      <Maya/>

    </Center>
  </>
}

function App() {

  const controls = useControls({
    fogIntensity: {
      value: 0.30,
      step: 0.01,
      min: 0,
      max: 1
    },
    fogAmount: {
      value: 0.07,
      step: 0.01,
      min: 0,
      max: 1
    },
    gradient: {
      options: [
        "gradient_ramp.webp",
        "gradient_ramp2.webp",
        "gradient_ramp3.webp",
      ]
    }

  })
  return (
    <>
      <Canvas>
        <color attach={"background"} args={["#080a19"]}/>
        <Scene/>

        <ambientLight intensity={0.5}/>
        <directionalLight position={[10, 10, 0]} intensity={1}/>

        <EffectComposer>
          <GradientFog gradientPath={controls.gradient} fogIntensity={controls.fogIntensity}
                       fogAmount={controls.fogAmount}/>
        </EffectComposer>
        <Environment preset="night"/>

      </Canvas>
    </>
  );
}

export default App;
