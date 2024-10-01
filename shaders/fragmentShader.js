const fragmentShader =
`
uniform vec2 u_resolution;
uniform vec3 u_lightPosition;  
uniform vec3 u_objectPosition; 

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;

    float distFromLight = distance(st, vec2(u_lightPosition.x, u_lightPosition.y));

    float shadow = 1.0 - smoothstep(0.1, 0.2, distFromLight);

    gl_FragColor = vec4(vec3(shadow), 1.0);
}
`
// `
// void main(){
//     gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
// }
// `
export default fragmentShader
