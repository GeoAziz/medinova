import '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      sphereGeometry: any;
      cylinderGeometry: any;
      meshStandardMaterial: any;
      ambientLight: any;
      directionalLight: any;
    }
  }
}
