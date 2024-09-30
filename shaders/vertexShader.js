const vertexShader = `
    void main() {
        gl_Position = vec4( position, 0.1 );
    }
`
export default vertexShader