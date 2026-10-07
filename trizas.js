/* =========================================================
   TriZas V0.2
   Lightweight WebGL 3D Engine
========================================================= */

const DEG = Math.PI / 180;


/* =========================================================
   Vector3
========================================================= */

export class Vector3 {

    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }

    clone() {
        return new Vector3(this.x, this.y, this.z);
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    multiplyScalar(v) {
        this.x *= v;
        this.y *= v;
        this.z *= v;
        return this;
    }

    length() {
        return Math.hypot(this.x, this.y, this.z);
    }

    normalize() {
        const l = this.length();

        if (l > 0) {
            this.multiplyScalar(1 / l);
        }

        return this;
    }

    distanceTo(v) {
        return Math.hypot(
            this.x - v.x,
            this.y - v.y,
            this.z - v.z
        );
    }
}


/* =========================================================
   Matrix4
========================================================= */

export class Matrix4 {

    constructor() {
        this.elements = new Float32Array(16);
        this.identity();
    }

    identity() {

        const e = this.elements;

        e.fill(0);

        e[0] = 1;
        e[5] = 1;
        e[10] = 1;
        e[15] = 1;

        return this;
    }

    copy(m) {
        this.elements.set(m.elements);
        return this;
    }

    multiply(a, b) {

        const ae = a.elements;
        const be = b.elements;
        const te = this.elements;

        const a00 = ae[0];
        const a01 = ae[1];
        const a02 = ae[2];
        const a03 = ae[3];

        const a10 = ae[4];
        const a11 = ae[5];
        const a12 = ae[6];
        const a13 = ae[7];

        const a20 = ae[8];
        const a21 = ae[9];
        const a22 = ae[10];
        const a23 = ae[11];

        const a30 = ae[12];
        const a31 = ae[13];
        const a32 = ae[14];
        const a33 = ae[15];

        const b0 = be[0];
        const b1 = be[1];
        const b2 = be[2];
        const b3 = be[3];

        te[0] =
            a00 * b0 +
            a10 * b1 +
            a20 * b2 +
            a30 * b3;

        te[1] =
            a01 * b0 +
            a11 * b1 +
            a21 * b2 +
            a31 * b3;

        te[2] =
            a02 * b0 +
            a12 * b1 +
            a22 * b2 +
            a32 * b3;

        te[3] =
            a03 * b0 +
            a13 * b1 +
            a23 * b2 +
            a33 * b3;


        b0 = be[4];
        b1 = be[5];
        b2 = be[6];
        b3 = be[7];

        te[4] =
            a00 * b0 +
            a10 * b1 +
            a20 * b2 +
            a30 * b3;

        te[5] =
            a01 * b0 +
            a11 * b1 +
            a21 * b2 +
            a31 * b3;

        te[6] =
            a02 * b0 +
            a12 * b1 +
            a22 * b2 +
            a32 * b3;

        te[7] =
            a03 * b0 +
            a13 * b1 +
            a23 * b2 +
            a33 * b3;


        b0 = be[8];
        b1 = be[9];
        b2 = be[10];
        b3 = be[11];

        te[8] =
            a00 * b0 +
            a10 * b1 +
            a20 * b2 +
            a30 * b3;

        te[9] =
            a01 * b0 +
            a11 * b1 +
            a21 * b2 +
            a31 * b3;

        te[10] =
            a02 * b0 +
            a12 * b1 +
            a22 * b2 +
            a32 * b3;

        te[11] =
            a03 * b0 +
            a13 * b1 +
            a23 * b2 +
            a33 * b3;


        b0 = be[12];
        b1 = be[13];
        b2 = be[14];
        b3 = be[15];

        te[12] =
            a00 * b0 +
            a10 * b1 +
            a20 * b2 +
            a30 * b3;

        te[13] =
            a01 * b0 +
            a11 * b1 +
            a21 * b2 +
            a31 * b3;

        te[14] =
            a02 * b0 +
            a12 * b1 +
            a22 * b2 +
            a32 * b3;

        te[15] =
            a03 * b0 +
            a13 * b1 +
            a23 * b2 +
            a33 * b3;

        return this;
    }

    translation(x, y, z) {

        this.identity();

        this.elements[12] = x;
        this.elements[13] = y;
        this.elements[14] = z;

        return this;
    }

    scale(x, y, z) {

        this.identity();

        this.elements[0] = x;
        this.elements[5] = y;
        this.elements[10] = z;

        return this;
    }

    rotationX(r) {

        this.identity();

        const c = Math.cos(r);
        const s = Math.sin(r);

        this.elements[5] = c;
        this.elements[6] = s;
        this.elements[9] = -s;
        this.elements[10] = c;

        return this;
    }

    rotationY(r) {

        this.identity();

        const c = Math.cos(r);
        const s = Math.sin(r);

        this.elements[0] = c;
        this.elements[2] = -s;
        this.elements[8] = s;
        this.elements[10] = c;

        return this;
    }

    rotationZ(r) {

        this.identity();

        const c = Math.cos(r);
        const s = Math.sin(r);

        this.elements[0] = c;
        this.elements[1] = s;
        this.elements[4] = -s;
        this.elements[5] = c;

        return this;
    }

    perspective(fov, aspect, near, far) {

        const f =
            1 / Math.tan(fov * DEG / 2);

        const e = this.elements;

        e.fill(0);

        e[0] = f / aspect;
        e[5] = f;

        e[10] =
            (far + near) /
            (near - far);

        e[11] = -1;

        e[14] =
            (2 * far * near) /
            (near - far);

        return this;
    }
}


/* =========================================================
   Object3D
========================================================= */

export class Object3D {

    constructor() {

        this.position = new Vector3();

        this.rotation = new Vector3();

        this.scale = new Vector3(1, 1, 1);

        this.children = [];

        this.parent = null;

        this.visible = true;
    }

    add(...objects) {

        for (const object of objects) {

            if (object.parent) {
                object.parent.remove(object);
            }

            object.parent = this;
            this.children.push(object);
        }

        return this;
    }

    remove(object) {

        const i =
            this.children.indexOf(object);

        if (i >= 0) {
            this.children.splice(i, 1);
            object.parent = null;
        }

        return this;
    }
}


/* =========================================================
   Scene
========================================================= */

export class Scene extends Object3D {

    constructor() {

        super();

        this.background = 0x050914;
    }
}


/* =========================================================
   Camera
========================================================= */

export class PerspectiveCamera extends Object3D {

    constructor(
        fov = 70,
        aspect = 1,
        near = 0.1,
        far = 1000
    ) {

        super();

        this.fov = fov;
        this.aspect = aspect;
        this.near = near;
        this.far = far;

        this.projectionMatrix =
            new Matrix4();

        this.updateProjectionMatrix();
    }

    updateProjectionMatrix() {

        this.projectionMatrix.perspective(
            this.fov,
            this.aspect,
            this.near,
            this.far
        );
    }
}


/* =========================================================
   Geometry
========================================================= */

export class Geometry {

    constructor() {

        this.vertices = [];
        this.indices = [];
    }
}


export class BoxGeometry extends Geometry {

    constructor(w = 1, h = 1, d = 1) {

        super();

        const x = w / 2;
        const y = h / 2;
        const z = d / 2;

        this.vertices = [

            -x,-y,-z,
             x,-y,-z,
             x, y,-z,
            -x, y,-z,

            -x,-y, z,
             x,-y, z,
             x, y, z,
            -x, y, z
        ];

        this.indices = [

            0,1,2,
            0,2,3,

            4,6,5,
            4,7,6,

            0,4,5,
            0,5,1,

            3,2,6,
            3,6,7,

            1,5,6,
            1,6,2,

            0,3,7,
            0,7,4
        ];
    }
}


export class PlaneGeometry extends Geometry {

    constructor(w = 1, d = 1) {

        super();

        const x = w / 2;
        const z = d / 2;

        this.vertices = [
            -x,0,-z,
             x,0,-z,
             x,0, z,
            -x,0, z
        ];

        this.indices = [
            0,1,2,
            0,2,3
        ];
    }
}


export class SphereGeometry extends Geometry {

    constructor(
        radius = 1,
        widthSegments = 16,
        heightSegments = 10
    ) {

        super();

        for (
            let y = 0;
            y <= heightSegments;
            y++
        ) {

            const v =
                y / heightSegments;

            const phi =
                v * Math.PI;

            for (
                let x = 0;
                x <= widthSegments;
                x++
            ) {

                const u =
                    x / widthSegments;

                const theta =
                    u * Math.PI * 2;

                const sx =
                    -radius *
                    Math.cos(theta) *
                    Math.sin(phi);

                const sy =
                    radius *
                    Math.cos(phi);

                const sz =
                    radius *
                    Math.sin(theta) *
                    Math.sin(phi);

                this.vertices.push(
                    sx, sy, sz
                );
            }
        }

        for (
            let y = 0;
            y < heightSegments;
            y++
        ) {

            for (
                let x = 0;
                x < widthSegments;
                x++
            ) {

                const a =
                    y * (widthSegments + 1) + x;

                const b = a + widthSegments + 1;

                this.indices.push(
                    a, b, a + 1,
                    b, b + 1, a + 1
                );
            }
        }
    }
}


export class CylinderGeometry extends Geometry {

    constructor(
        radius = 1,
        height = 2,
        segments = 16
    ) {

        super();

        for (
            let y = 0;
            y <= 1;
            y++
        ) {

            const py =
                (y - .5) * height;

            for (
                let i = 0;
                i <= segments;
                i++
            ) {

                const a =
                    i / segments * Math.PI * 2;

                this.vertices.push(
                    Math.cos(a) * radius,
                    py,
                    Math.sin(a) * radius
                );
            }
        }

        for (
            let i = 0;
            i < segments;
            i++
        ) {

            const a = i;
            const b = i + segments + 1;

            this.indices.push(
                a, b, a + 1,
                b, b + 1, a + 1
            );
        }

        const bottom =
            this.vertices.length / 3;

        this.vertices.push(
            0, -height / 2, 0
        );

        const top =
            bottom + 1;

        this.vertices.push(
            0, height / 2, 0
        );

        for (
            let i = 0;
            i < segments;
            i++
        ) {

            const n = i + 1;

            this.indices.push(
                bottom,
                n,
                i
            );

            this.indices.push(
                top,
                segments + 1 + i,
                segments + 1 + n
            );
        }
    }
}


/* =========================================================
   Material
========================================================= */

export class MeshBasicMaterial {

    constructor(options = {}) {

        this.color =
            options.color ?? 0xffffff;

        this.opacity =
            options.opacity ?? 1;
    }
}


/* =========================================================
   Mesh / Group
========================================================= */

export class Mesh extends Object3D {

    constructor(geometry, material) {

        super();

        this.geometry = geometry;

        this.material =
            material ??
            new MeshBasicMaterial();
    }
}


export class Group extends Object3D {

    constructor() {
        super();
    }
}


/* =========================================================
   Lights
========================================================= */

export class AmbientLight extends Object3D {

    constructor(
        color = 0xffffff,
        intensity = 1
    ) {

        super();

        this.color = color;
        this.intensity = intensity;
    }
}


export class DirectionalLight extends Object3D {

    constructor(
        color = 0xffffff,
        intensity = 1
    ) {

        super();

        this.color = color;
        this.intensity = intensity;
    }
}


/* =========================================================
   Renderer
========================================================= */

function hexColor(hex) {

    return [

        ((hex >> 16) & 255) / 255,

        ((hex >> 8) & 255) / 255,

        (hex & 255) / 255
    ];
}


function shader(gl, type, source) {

    const s =
        gl.createShader(type);

    gl.shaderSource(s, source);

    gl.compileShader(s);

    if (
        !gl.getShaderParameter(
            s,
            gl.COMPILE_STATUS
        )
    ) {

        throw new Error(
            gl.getShaderInfoLog(s)
        );
    }

    return s;
}


export class Renderer {

    constructor(canvas, options = {}) {

        this.canvas = canvas;

        this.gl =
            canvas.getContext(
                "webgl",
                {
                    antialias:
                        options.antialias ?? true,

                    alpha: false,

                    powerPreference:
                        "high-performance"
                }
            );

        if (!this.gl) {
            throw new Error(
                "TriZas: WebGL을 사용할 수 없습니다."
            );
        }

        this.pixelRatio = 1;

        this.program =
            this.createProgram();

        const gl = this.gl;

        this.positionLocation =
            gl.getAttribLocation(
                this.program,
                "aPosition"
            );

        this.matrixLocation =
            gl.getUniformLocation(
                this.program,
                "uMatrix"
            );

        this.colorLocation =
            gl.getUniformLocation(
                this.program,
                "uColor"
            );

        gl.enable(gl.DEPTH_TEST);

        gl.enable(gl.CULL_FACE);

        gl.cullFace(gl.BACK);
    }


    createProgram() {

        const gl = this.gl;

        const vertex = shader(
            gl,
            gl.VERTEX_SHADER,

            `
            attribute vec3 aPosition;

            uniform mat4 uMatrix;

            void main() {

                gl_Position =
                    uMatrix *
                    vec4(aPosition, 1.0);
            }
            `
        );


        const fragment = shader(
            gl,
            gl.FRAGMENT_SHADER,

            `
            precision mediump float;

            uniform vec3 uColor;

            void main() {

                gl_FragColor =
                    vec4(uColor, 1.0);
            }
            `
        );


        const program =
            gl.createProgram();

        gl.attachShader(
            program,
            vertex
        );

        gl.attachShader(
            program,
            fragment
        );

        gl.linkProgram(program);

        if (
            !gl.getProgramParameter(
                program,
                gl.LINK_STATUS
            )
        ) {

            throw new Error(
                gl.getProgramInfoLog(program)
            );
        }

        return program;
    }


    setPixelRatio(value) {

        this.pixelRatio =
            Math.max(1, value);
    }


    setSize(width, height) {

        const ratio =
            this.pixelRatio;

        this.canvas.width =
            Math.floor(width * ratio);

        this.canvas.height =
            Math.floor(height * ratio);

        this.canvas.style.width =
            width + "px";

        this.canvas.style.height =
            height + "px";

        this.gl.viewport(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    }


    createGPUData(mesh) {

        const gl = this.gl;

        mesh.__vertexBuffer =
            gl.createBuffer();

        gl.bindBuffer(
            gl.ARRAY_BUFFER,
            mesh.__vertexBuffer
        );

        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(
                mesh.geometry.vertices
            ),
            gl.STATIC_DRAW
        );


        mesh.__indexBuffer =
            gl.createBuffer();

        gl.bindBuffer(
            gl.ELEMENT_ARRAY_BUFFER,
            mesh.__indexBuffer
        );

        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(
                mesh.geometry.indices
            ),
            gl.STATIC_DRAW
        );

        mesh.__indexCount =
            mesh.geometry.indices.length;
    }


    render(scene, camera) {

        const gl = this.gl;

        gl.clearColor(
            ...hexColor(scene.background),
            1
        );

        gl.clear(
            gl.COLOR_BUFFER_BIT |
            gl.DEPTH_BUFFER_BIT
        );

        gl.useProgram(
            this.program
        );


        const rx =
            new Matrix4()
                .rotationX(
                    -camera.rotation.x
                );

        const ry =
            new Matrix4()
                .rotationY(
                    -camera.rotation.y
                );

        const rz =
            new Matrix4()
                .rotationZ(
                    -camera.rotation.z
                );

        const cameraTranslation =
            new Matrix4()
                .translation(
                    -camera.position.x,
                    -camera.position.y,
                    -camera.position.z
                );


        let view =
            new Matrix4();

        view.multiply(
            ry,
            cameraTranslation
        );

        view.multiply(
            rx,
            view
        );

        view.multiply(
            rz,
            view
        );


        const drawObject =
            (object, parentWorld = null) => {

                if (!object.visible) {
                    return;
                }


                let world =
                    new Matrix4();

                const translation =
                    new Matrix4()
                        .translation(
                            object.position.x,
                            object.position.y,
                            object.position.z
                        );

                const rotationY =
                    new Matrix4()
                        .rotationY(
                            object.rotation.y
                        );

                const rotationX =
                    new Matrix4()
                        .rotationX(
                            object.rotation.x
                        );

                const rotationZ =
                    new Matrix4()
                        .rotationZ(
                            object.rotation.z
                        );

                const scale =
                    new Matrix4()
                        .scale(
                            object.scale.x,
                            object.scale.y,
                            object.scale.z
                        );


                world.multiply(
                    translation,
                    rotationY
                );

                world.multiply(
                    world,
                    rotationX
                );

                world.multiply(
                    world,
                    rotationZ
                );

                world.multiply(
                    world,
                    scale
                );


                if (parentWorld) {

                    const combined =
                        new Matrix4();

                    combined.multiply(
                        parentWorld,
                        world
                    );

                    world = combined;
                }


                if (
                    object instanceof Mesh
                ) {

                    if (!object.__vertexBuffer) {
                        this.createGPUData(object);
                    }


                    let vm =
                        new Matrix4();

                    vm.multiply(
                        view,
                        world
                    );


                    let final =
                        new Matrix4();

                    final.multiply(
                        camera.projectionMatrix,
                        vm
                    );


                    gl.uniformMatrix4fv(
                        this.matrixLocation,
                        false,
                        final.elements
                    );


                    gl.uniform3fv(
                        this.colorLocation,
                        hexColor(
                            object.material.color
                        )
                    );


                    gl.bindBuffer(
                        gl.ARRAY_BUFFER,
                        object.__vertexBuffer
                    );

                    gl.enableVertexAttribArray(
                        this.positionLocation
                    );

                    gl.vertexAttribPointer(
                        this.positionLocation,
                        3,
                        gl.FLOAT,
                        false,
                        0,
                        0
                    );


                    gl.bindBuffer(
                        gl.ELEMENT_ARRAY_BUFFER,
                        object.__indexBuffer
                    );


                    gl.drawElements(
                        gl.TRIANGLES,
                        object.__indexCount,
                        gl.UNSIGNED_SHORT,
                        0
                    );
                }


                for (
                    const child of object.children
                ) {

                    drawObject(
                        child,
                        world
                    );
                }
            };


        drawObject(scene);
    }
}


/* =========================================================
   Input
========================================================= */

export class Keyboard {

    constructor() {

        this.keys = new Set();

        addEventListener(
            "keydown",
            e => this.keys.add(e.code)
        );

        addEventListener(
            "keyup",
            e => this.keys.delete(e.code)
        );
    }

    down(code) {
        return this.keys.has(code);
    }
}


/* =========================================================
   Clock
========================================================= */

export class Clock {

    constructor() {

        this.last =
            performance.now();

        this.delta = 0;

        this.elapsed = 0;
    }

    tick() {

        const now =
            performance.now();

        this.delta =
            Math.min(
                (now - this.last) / 1000,
                0.05
            );

        this.last = now;

        this.elapsed +=
            this.delta;

        return this.delta;
    }
}
