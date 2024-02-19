import {Effect, EffectAttribute} from 'postprocessing';
import {forwardRef, useMemo} from 'react';
import {Uniform} from 'three';
import {useThree} from '@react-three/fiber';
import {useTexture} from '@react-three/drei';

const fogFragmentShader = `
uniform sampler2D gradient; // The fog gradient texture
uniform float fog_intensity;
uniform float fog_amount;
uniform mat4 cameraInverseProjectionMatrix; // Inverse projection matrix of the camera

void mainImage(const in vec4 inputColor, const in vec2 uv, const in float depth, out vec4 outputColor) {
    vec4 original = inputColor;
    float viewZ = getViewZ(depth);
   
    float fogFactor = clamp(-viewZ * fog_amount, 0.0, 1.0);
    vec4 fogColor = texture2D(gradient, vec2(fogFactor, 0.0) );
    outputColor = mix(original, fogColor, fogColor.a * fog_intensity);
}
  `


class GradientFogEffect extends Effect {
  constructor({gradient, fogIntensity, fogAmount, camera}) {

    super('GradientFogEffect', fogFragmentShader, {
      uniforms: new Map([
        ['gradient', new Uniform(gradient)],
        ['fog_intensity', new Uniform(fogIntensity)],
        ['fog_amount', new Uniform(fogAmount)],
        ['cameraInverseProjectionMatrix', new Uniform(camera.matrixWorldInverse)],
      ]),
    });
    super.setAttributes(EffectAttribute.DEPTH);
  }
}


export const GradientFog = forwardRef(({gradientPath, fogIntensity = 0.5, fogAmount = 0.1}, ref) => {
  const camera = useThree(({camera}) => camera)

  const gradientTexture = useTexture(gradientPath);
  const effect = useMemo(() => new GradientFogEffect({
    gradient: gradientTexture,
    fogIntensity,
    fogAmount,
    camera
  }), [gradientPath, fogIntensity, fogAmount, camera])

  return <primitive ref={ref} object={effect} dispose={null}/>
})
