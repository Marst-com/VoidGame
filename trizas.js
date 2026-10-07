/* =========================================================
   TriZas V0.3
   Standalone WebGL Engine
   No CDN
   No import
   No export
========================================================= */

(function (global) {

"use strict";


/* =========================================================
   VECTOR3
========================================================= */

class Vector3 {

    constructor(x, y, z) {

        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
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

        return new Vector3(
            this.x,
            this.y,
            this.z
        );
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

    multiplyScalar(n) {

        this.x *= n;
        this.y *= n;
        this.z *= n;

        return this;
    }

    length() {

        return Math.sqrt(
            this.x * this.x +
            this.y * this.y +
            this.z * this.z
        );
    }

    normalize() {

        const length = this.length();

        if (length > 0) {

            this.x /= length;
            this.y /= length;
            this.z /= length;
        }

        return this;
    }

    distanceTo(v) {

        return Math.sqrt(
            (this.x - v.x) ** 2 +
            (this.y - v.y) ** 2 +
            (this.z - v.z) ** 2
        );
    }
}


/* =========================================================
   MATRIX4
========================================================= */

class Matrix4 {

    constructor() {

        this.elements =
            new Float32Array(16);

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

    multiply(a, b) {

        const ae = a.elements;
        const be = b.elements;
        const te = this.elements;

        for (let row = 0; row < 4; row++) {

            for (let col = 0; col < 4; col++) {

                te[col * 4 + row] =

                    ae[0 * 4 + row] *
                    be[col * 4 + 0] +

                    ae[1 * 4 + row] *
                    be[col * 4 + 1] +

                    ae[2 * 4 + row] *
                    be[col * 4 + 2] +

                    ae[3 * 4 + row] *
                    be[col * 4 + 3];
            }
        }

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

    perspective(
        fov,
        aspect,
        near,
        far
    ) {

        const f =
            1 /
            Math.tan(
                fov * Math.PI / 360
            );

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
   OBJECT3D
========================================================= */

class Object3D {

    constructor() {

        this.position =
            new Vector3();

        this.rotation =
            new Vector3();

        this.scale =
            new Vector3(1, 1, 1);

        this.children = [];

        this.parent = null;

        this.visible = true;
    }

    add() {

        for (
            let i = 0;
            i < arguments.length;
            i++
        ) {

            const child =
                arguments[i];

            if (child.parent) {
                child.parent.remove(child);
            }

            child.parent = this;

            this.children.push(child);
        }

        return this;
    }

    remove(child) {

        const index =
            this.children.indexOf(child);

        if (index !== -1) {

            this.children.splice(
                index,
                1
            );

            child.parent = null;
        }

        return this;
    }
}


/* =========================================================
   SCENE
========================================================= */

class Scene extends Object3D {

    constructor() {

        super();

        this.background =
            0x050912;
    }
}


/* =========================================================
   CAMERA
========================================================= */

class PerspectiveCamera
    extends Object3D {

    constructor(
        fov,
        aspect,
        near,
        far
    ) {

        super();

        this.fov =
            fov || 70;

        this.aspect =
            aspect || 1;

        this.near =
            near || .1;

        this.far =
            far || 1000;

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
   GEOMETRY
========================================================= */

class Geometry {

    constructor() {

        this.vertices = [];
        this.indices = [];
    }
}


/* =========================================================
   BOX
========================================================= */

class BoxGeometry extends Geometry {

    constructor(w, h, d) {

        super();

        w = w || 1;
        h = h || 1;
        d = d || 1;

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


/* =========================================================
   PLANE
========================================================= */

class PlaneGeometry
    extends Geometry {

    constructor(w, d) {

        super();

        w = w || 1;
        d = d || 1;

        const x = w / 2;
        const z = d / 2;

        this.vertices = [

            -x, 0, -z,
             x, 0, -z,
             x, 0,  z,
            -x, 0,  z
        ];

        this.indices = [
            0,1,2,
            0,2,3
        ];
    }
}


/* =========================================================
   SPHERE
========================================================= */

class SphereGeometry
    extends Geometry {

    constructor(
        radius,
        widthSegments,
        heightSegments
    ) {

        super();

        radius =
            radius || 1;

        widthSegments =
            widthSegments || 16;

        heightSegments =
            heightSegments || 10;


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

                this.vertices.push(

                    radius *
                    Math.sin(phi) *
                    Math.cos(theta),

                    radius *
                    Math.cos(phi),

                    radius *
                    Math.sin(phi) *
                    Math.sin(theta)
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
                    y *
                    (widthSegments + 1) +
                    x;

                const b =
                    a +
                    widthSegments +
                    1;

                this.indices.push(

                    a,
                    b,
                    a + 1,

                    b,
                    b + 1,
                    a + 1
                );
            }
        }
    }
}


/* =========================================================
   CYLINDER
========================================================= */

class CylinderGeometry
    extends Geometry {

    constructor(
        radius,
        height,
        segments
    ) {

        super();

        radius =
            radius || 1;

        height =
            height || 2;

        segments =
            segments || 16;


        for (
            let row = 0;
            row <= 1;
            row++
        ) {

            const y =
                (row - .5) *
                height;

            for (
                let i = 0;
                i <= segments;
                i++
            ) {

                const a =
                    i /
                    segments *
                    Math.PI *
                    2;

                this.vertices.push(

                    Math.cos(a) * radius,
                    y,
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

            const b =
                i + segments + 1;

            this.indices.push(

                a,
                b,
                a + 1,

                b,
                b + 1,
                a + 1
            );
        }
    }
}


/* =========================================================
   MATERIAL
========================================================= */

class MeshBasicMaterial {

    constructor(options) {

        options =
            options || {};

        this.color =
            options.color === undefined
                ? 0xffffff
                : options.color;
    }
}


/* =========================================================
   MESH
========================================================= */

class Mesh extends Object3D {

    constructor(
        geometry,
        material
    ) {

        super();

        this.geometry =
            geometry;

        this.material =
            material ||
            new MeshBasicMaterial();
    }
}


/* =========================================================
   GROUP
========================================================= */

class Group extends Object3D {

    constructor() {

        super();
    }
}


/* =========================================================
   RENDERER
========================================================= */

function hexRGB(hex) {

    return [

        ((hex >> 16) & 255) / 255,

        ((hex >> 8) & 255) / 255,

        (hex & 255) / 255
    ];
}


class Renderer {

    constructor(canvas) {

        this.canvas =
            canvas;

        this.gl =
            canvas.getContext(
                "webgl",
                {
                    antialias: true,
                    alpha: false,
                    powerPreference:
                        "high-performance"
                }
            );

        if (!this.gl) {

            throw new Error(
                "WebGL을 사용할 수 없음"
            );
        }

        this.pixelRatio = 1;

        this.program =
            this.createProgram();

        const gl =
            this.gl;

        this.aPosition =
            gl.getAttribLocation(
                this.program,
                "aPosition"
            );

        this.uMatrix =
            gl.getUniformLocation(
                this.program,
                "uMatrix"
            );

        this.uColor =
            gl.getUniformLocation(
                this.program,
                "uColor"
            );

        gl.enable(
            gl.DEPTH_TEST
        );

        gl.enable(
            gl.CULL_FACE
        );
    }


    createProgram() {

        const gl =
            this.gl;

        const vertexSource = `

            attribute vec3 aPosition;

            uniform mat4 uMatrix;

            void main() {

                gl_Position =
                    uMatrix *
                    vec4(
                        aPosition,
                        1.0
                    );
            }
        `;


        const fragmentSource = `

            precision mediump float;

            uniform vec3 uColor;

            void main() {

                gl_FragColor =
                    vec4(
                        uColor,
                        1.0
                    );
            }
        `;


        const vertex =
            this.compile(
                gl.VERTEX_SHADER,
                vertexSource
            );

        const fragment =
            this.compile(
                gl.FRAGMENT_SHADER,
                fragmentSource
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

        gl.linkProgram(
            program
        );


        if (
            !gl.getProgramParameter(
                program,
                gl.LINK_STATUS
            )
        ) {

            throw new Error(
                gl.getProgramInfoLog(
                    program
                )
            );
        }

        return program;
    }


    compile(type, source) {

        const gl =
            this.gl;

        const shader =
            gl.createShader(type);

        gl.shaderSource(
            shader,
            source
        );

        gl.compileShader(
            shader
        );


        if (
            !gl.getShaderParameter(
                shader,
                gl.COMPILE_STATUS
            )
        ) {

            throw new Error(
                gl.getShaderInfoLog(
                    shader
                )
            );
        }

        return shader;
    }


    setPixelRatio(ratio) {

        this.pixelRatio =
            Math.max(
                1,
                ratio || 1
            );
    }


    setSize(width, height) {

        const ratio =
            this.pixelRatio;

        this.canvas.width =
            Math.floor(
                width * ratio
            );

        this.canvas.height =
            Math.floor(
                height * ratio
            );

        this.gl.viewport(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
    }


    upload(mesh) {

        const gl =
            this.gl;


        mesh._vertex =
            gl.createBuffer();

        gl.bindBuffer(
            gl.ARRAY_BUFFER,
            mesh._vertex
        );

        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array(
                mesh.geometry.vertices
            ),
            gl.STATIC_DRAW
        );


        mesh._index =
            gl.createBuffer();

        gl.bindBuffer(
            gl.ELEMENT_ARRAY_BUFFER,
            mesh._index
        );

        gl.bufferData(
            gl.ELEMENT_ARRAY_BUFFER,
            new Uint16Array(
                mesh.geometry.indices
            ),
            gl.STATIC_DRAW
        );


        mesh._count =
            mesh.geometry.indices.length;
    }


    render(scene, camera) {

        const gl =
            this.gl;


        gl.clearColor(
            ...hexRGB(
                scene.background
            ),
            1
        );


        gl.clear(
            gl.COLOR_BUFFER_BIT |
            gl.DEPTH_BUFFER_BIT
        );


        gl.useProgram(
            this.program
        );


        const cameraX =
            new Matrix4()
                .rotationX(
                    -camera.rotation.x
                );

        const cameraY =
            new Matrix4()
                .rotationY(
                    -camera.rotation.y
                );

        const cameraZ =
            new Matrix4()
                .rotationZ(
                    -camera.rotation.z
                );

        const cameraPosition =
            new Matrix4()
                .translation(
                    -camera.position.x,
                    -camera.position.y,
                    -camera.position.z
                );


        let view =
            new Matrix4();

        view.multiply(
            cameraY,
            cameraPosition
        );

        view.multiply(
            cameraX,
            view
        );

        view.multiply(
            cameraZ,
            view
        );


        const draw =
            (
                object,
                parentWorld
            ) => {

                if (
                    !object.visible
                ) {
                    return;
                }


                let world =
                    new Matrix4();


                const position =
                    new Matrix4()
                        .translation(
                            object.position.x,
                            object.position.y,
                            object.position.z
                        );


                const rotX =
                    new Matrix4()
                        .rotationX(
                            object.rotation.x
                        );


                const rotY =
                    new Matrix4()
                        .rotationY(
                            object.rotation.y
                        );


                const rotZ =
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
                    position,
                    rotY
                );

                world.multiply(
                    world,
                    rotX
                );

                world.multiply(
                    world,
                    rotZ
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

                    world =
                        combined;
                }


                if (
                    object instanceof Mesh
                ) {

                    if (
                        !object._vertex
                    ) {

                        this.upload(
                            object
                        );
                    }


                    let vm =
                        new Matrix4();

                    vm.multiply(
                        view,
                        world
                    );


                    let finalMatrix =
                        new Matrix4();

                    finalMatrix.multiply(
                        camera.projectionMatrix,
                        vm
                    );


                    gl.uniformMatrix4fv(
                        this.uMatrix,
                        false,
                        finalMatrix.elements
                    );


                    gl.uniform3fv(
                        this.uColor,
                        hexRGB(
                            object.material.color
                        )
                    );


                    gl.bindBuffer(
                        gl.ARRAY_BUFFER,
                        object._vertex
                    );


                    gl.enableVertexAttribArray(
                        this.aPosition
                    );


                    gl.vertexAttribPointer(
                        this.aPosition,
                        3,
                        gl.FLOAT,
                        false,
                        0,
                        0
                    );


                    gl.bindBuffer(
                        gl.ELEMENT_ARRAY_BUFFER,
                        object._index
                    );


                    gl.drawElements(
                        gl.TRIANGLES,
                        object._count,
                        gl.UNSIGNED_SHORT,
                        0
                    );
                }


                for (
                    let i = 0;
                    i < object.children.length;
                    i++
                ) {

                    draw(
                        object.children[i],
                        world
                    );
                }
            };


        draw(scene, null);
    }
}


/* =========================================================
   KEYBOARD
========================================================= */

class Keyboard {

    constructor() {

        this.keys = {};

        window.addEventListener(
            "keydown",
            e => {

                this.keys[e.code] =
                    true;
            }
        );

        window.addEventListener(
            "keyup",
            e => {

                this.keys[e.code] =
                    false;
            }
        );
    }

    down(code) {

        return !!this.keys[code];
    }
}


/* =========================================================
   CLOCK
========================================================= */

class Clock {

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
                .05
            );

        this.last =
            now;

        this.elapsed +=
            this.delta;

        return this.delta;
    }
}


/* =========================================================
   EXPORT TO GLOBAL
========================================================= */

global.TriZas = {

    Vector3,
    Matrix4,

    Object3D,
    Scene,

    PerspectiveCamera,

    Geometry,

    BoxGeometry,
    PlaneGeometry,
    SphereGeometry,
    CylinderGeometry,

    MeshBasicMaterial,

    Mesh,
    Group,

    Renderer,

    Keyboard,
    Clock
};

})(window);
