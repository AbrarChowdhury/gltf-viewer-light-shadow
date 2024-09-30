const fragmentShader = `
uniform float parameter;

void main() {
    vec4 pixel =  gl_FragCoord;
    gl_FragColor=vec4(sin(pixel.x+parameter),cos(parameter*pixel.y),0,1.0);
}
`
export default fragmentShader
