/* =========================================================
   TriZas V0.1
   Lightweight WebGL 3D Engine
   ASTERIA Edition
========================================================= */


/* =========================================================
   MATH
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

  multiplyScalar(s) {
    this.x *= s;
    this.y *= s;
    this.z *= s;
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

    const l = this.length();

    if (l > 0) {
      this.multiplyScalar(1 / l);
    }

    return this;
  }
}


/* =========================================================
   MATRIX
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

  perspective(
    fov,
    aspect,
    near,
    far
  ) {

    const e = this.elements;

    const f =
      1 / Math.tan(
        fov * Math.PI / 360
      );

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

  multiply(a, b) {

    const ae = a.elements;
    const be = b.elements;
    const te = this.elements;

    for (let i = 0; i < 4; i++) {

      const ai0 = ae[i];
      const ai1 = ae[i + 4];
      const ai2 = ae[i + 8];
      const ai3 = ae[i + 12];

      te[i] =
        ai0 * be[0] +
        ai1 * be[1] +
        ai2 * be[2] +
        ai3 * be[3];

      te[i + 4] =
        ai0 * be[4] +
        ai1 * be[5] +
        ai2 * be[6] +
        ai3 * be[7];

      te[i + 8] =
        ai0 * be[8] +
        ai1 * be[9] +
        ai2 * be[10] +
        ai3 * be[11];

      te[i + 12] =
        ai0 * be[12] +
        ai1 * be[13] +
        ai2 * be[14] +
        ai3 * be[15];
    }

    return this;
  }

  translation(x, y, z) {

    this.identity();

    const e = this.elements;

    e[12] = x;
    e[13] = y;
    e[14] = z;

    return this;
  }

  rotationY(r) {

    this.identity();

    const c = Math.cos(r);
    const s = Math.sin(r);

    const e = this.elements;

    e[0] = c;
    e[2] = -s;
    e[8] = s;
    e[10] = c;

    return this;
  }

  rotationX(r) {

    this.identity();

    const c = Math.cos(r);
    const s = Math.sin(r);

    const e = this.elements;

    e[5] = c;
    e[6] = s;
    e[9] = -s;
    e[10] = c;

    return this;
  }

  scale(x, y, z) {

    this.identity();

    const e = this.elements;

    e[0] = x;
    e[5] = y;
    e[10] = z;

    return this;
  }
}


/* =========================================================
   OBJECT
========================================================= */

export class Object3D {

  constructor() {

    this.position = new Vector3();

    this.rotation = new Vector3();

    this.scale = new Vector3(
      1,
      1,
      1
    );

    this.children = [];

    this.parent = null;
  }

  add(object) {

    if (object.parent) {
      object.parent.remove(object);
    }

    object.parent = this;

    this.children.push(object);

    return this;
  }

  remove(object) {

    const i =
      this.children.indexOf(object);

    if (i !== -1) {

      this.children.splice(i, 1);

      object.parent = null;
    }

    return this;
  }
}


/* =========================================================
   SCENE
========================================================= */

export class Scene extends Object3D {

  constructor() {

    super();

    this.background = [0.015, 0.025, 0.05, 1];
  }
}


/* =========================================================
   CAMERA
========================================================= */

export class PerspectiveCamera extends Object3D {

  constructor(
    fov = 70,
    aspect = 1,
    near = .1,
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
   GEOMETRY
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


/* =========================================================
   MATERIAL
========================================================= */

export class MeshBasicMaterial {

  constructor(options = {}) {

    this.color =
      options.color ??
      0xffffff;
  }
}


/* =========================================================
   MESH
========================================================= */

export class Mesh extends Object3D {

  constructor(
    geometry,
    material
  ) {

    super();

    this.geometry = geometry;
    this.material = material;
  }
}


/* =========================================================
   GROUP
========================================================= */

export class Group extends Object3D {

  constructor() {
    super();
  }
}


/* =========================================================
   LIGHTS
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
   COLOR
========================================================= */

function colorToRGB(hex) {

  return [

    ((hex >> 16) & 255) / 255,

    ((hex >> 8) & 255) / 255,

    (hex & 255) / 255
  ];
}


/* =========================================================
   RENDERER
========================================================= */

export class Renderer {

  constructor(canvas) {

    this.canvas = canvas;

    this.gl =
      canvas.getContext(
        "webgl",
        {
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
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

    this.locations = {

      position:
        this.gl.getAttribLocation(
          this.program,
          "aPosition"
        ),

      matrix:
        this.gl.getUniformLocation(
          this.program,
          "uMatrix"
        ),

      color:
        this.gl.getUniformLocation(
          this.program,
          "uColor"
        )
    };

    this.gl.enable(
      this.gl.DEPTH_TEST
    );
  }


  setPixelRatio(value) {

    this.pixelRatio = value;
  }


  setSize(width, height) {

    this.canvas.width =
      width * this.pixelRatio;

    this.canvas.height =
      height * this.pixelRatio;

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


  createShader(type, source) {

    const gl = this.gl;

    const shader =
      gl.createShader(type);

    gl.shaderSource(
      shader,
      source
    );

    gl.compileShader(shader);

    if (
      !gl.getShaderParameter(
        shader,
        gl.COMPILE_STATUS
      )
    ) {

      throw new Error(
        gl.getShaderInfoLog(shader)
      );
    }

    return shader;
  }


  createProgram() {

    const vertexSource = `

      attribute vec3 aPosition;

      uniform mat4 uMatrix;

      void main() {

        gl_Position =
          uMatrix *
          vec4(aPosition, 1.0);
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


    const vs =
      this.createShader(
        this.gl.VERTEX_SHADER,
        vertexSource
      );

    const fs =
      this.createShader(
        this.gl.FRAGMENT_SHADER,
        fragmentSource
      );

    const program =
      this.gl.createProgram();

    this.gl.attachShader(
      program,
      vs
    );

    this.gl.attachShader(
      program,
      fs
    );

    this.gl.linkProgram(
      program
    );

    if (
      !this.gl.getProgramParameter(
        program,
        this.gl.LINK_STATUS
      )
    ) {

      throw new Error(
        this.gl.getProgramInfoLog(
          program
        )
      );
    }

    return program;
  }


  createBuffer(mesh) {

    const gl = this.gl;

    const position =
      gl.createBuffer();

    gl.bindBuffer(
      gl.ARRAY_BUFFER,
      position
    );

    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(
        mesh.geometry.vertices
      ),
      gl.STATIC_DRAW
    );


    const index =
      gl.createBuffer();

    gl.bindBuffer(
      gl.ELEMENT_ARRAY_BUFFER,
      index
    );

    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(
        mesh.geometry.indices
      ),
      gl.STATIC_DRAW
    );

    mesh.__positionBuffer =
      position;

    mesh.__indexBuffer =
      index;

    mesh.__indexCount =
      mesh.geometry.indices.length;
  }


  render(scene, camera) {

    const gl = this.gl;

    gl.clearColor(
      scene.background[0],
      scene.background[1],
      scene.background[2],
      scene.background[3]
    );

    gl.clear(
      gl.COLOR_BUFFER_BIT |
      gl.DEPTH_BUFFER_BIT
    );

    gl.useProgram(
      this.program
    );

    const view =
      new Matrix4();

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

    const tr =
      new Matrix4()
        .translation(
          -camera.position.x,
          -camera.position.y,
          -camera.position.z
        );

    let viewMatrix =
      new Matrix4();

    viewMatrix.multiply(
      ry,
      tr
    );

    viewMatrix.multiply(
      rx,
      viewMatrix
    );

    const projection =
      camera.projectionMatrix;


    const draw =
      (object, parentMatrix = null) => {

        if (
          object instanceof Mesh
        ) {

          if (!object.__positionBuffer) {
            this.createBuffer(object);
          }

          const translation =
            new Matrix4()
              .translation(
                object.position.x,
                object.position.y,
                object.position.z
              );

          const rotation =
            new Matrix4()
              .rotationY(
                object.rotation.y
              );

          const scale =
            new Matrix4()
              .scale(
                object.scale.x,
                object.scale.y,
                object.scale.z
              );

          let model =
            new Matrix4();

          model.multiply(
            translation,
            rotation
          );

          model.multiply(
            model,
            scale
          );


          if (parentMatrix) {

            const world =
              new Matrix4();

            world.multiply(
              parentMatrix,
              model
            );

            model = world;
          }


          let pv =
            new Matrix4();

          pv.multiply(
            viewMatrix,
            model
          );

          let final =
            new Matrix4();

          final.multiply(
            projection,
            pv
          );


          gl.uniformMatrix4fv(
            this.locations.matrix,
            false,
            final.elements
          );


          const rgb =
            colorToRGB(
              object.material.color
            );

          gl.uniform3fv(
            this.locations.color,
            rgb
          );


          gl.bindBuffer(
            gl.ARRAY_BUFFER,
            object.__positionBuffer
          );

          gl.enableVertexAttribArray(
            this.locations.position
          );

          gl.vertexAttribPointer(
            this.locations.position,
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

          draw(
            child,
            object instanceof Scene
              ? null
              : parentMatrix
          );
        }
      };


    draw(scene);
  }
}
