
// Property metadata is only used in Figma Design, so this is a no-op.
function defineProperties() {}

export default function Effect() { }
export function setup(device, frame) {
    var wgsl = `
diagnostic(off,derivative_uniformity);
struct Uniforms {
  frameData: vec4f,
  inputDimsData: vec4f,
  loopDuration: vec4f,
  pixelSize: vec4f,
  characterSize: vec4f,
  morphDuration: vec4f,
};
@group(0) @binding(0) var<uniform> u: Uniforms;

struct VsIn {
  @location(0) pos: vec2f,
  @location(1) uv: vec2f,
};
struct VsOut {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
};

// Every animal shares one articulated topology. Its corresponding joints,

// capsule radii, body axes and triangular appendages interpolate in space.

// There are no sprite switches, opacity fades or image crossfades.

fn labJoint(animal: i32, j: i32, gait: f32) -> vec3f {

  let s = sin(gait);

  let c = cos(gait);

  if (animal == 0) {

    // Flamingo: folded S neck, hooked bill, and two slender stepping legs.

    if (j == 0) { return vec3f(0.005, -0.015, 0.030); }

    if (j == 1) { return vec3f(0.068, -0.075, 0.023); }

    if (j == 2) { return vec3f(0.052, -0.160, 0.019); }

    if (j == 3) { return vec3f(0.058, -0.228, 0.021); }

    if (j == 4) { return vec3f(0.101, -0.252, 0.029); }

    if (j == 5) { return vec3f(0.129, -0.245, 0.016); }

    if (j == 6) { return vec3f(0.174, -0.226, 0.018); }

    if (j == 7) { return vec3f(0.163, -0.194, 0.009); }

    if (j >= 8 && j < 20) {

      let limb = (j - 8) / 3;

      let part = (j - 8) % 3;

      if (limb >= 2) {

        return vec3f(-0.055 + f32(limb - 2) * 0.025, 0.005, 0.008);

      }

      let wave = select(s, -s, limb == 1);

      let lift = max(0.0, select(c, -c, limb == 1));

      let hip = -0.044 + f32(limb) * 0.026;

      if (part == 0) { return vec3f(hip, 0.036, 0.010); }

      if (part == 1) { return vec3f(hip - wave * 0.045, 0.163 - lift * 0.035, 0.008); }

      return vec3f(hip + wave * 0.080 + 0.012, 0.294 - lift * 0.060, 0.009);

    }

    if (j == 20) { return vec3f(-0.115, -0.018, 0.029); }

    if (j == 21) { return vec3f(-0.151, -0.028, 0.022); }

    if (j == 22) { return vec3f(-0.183, -0.047, 0.011); }

    return vec3f(-0.204, -0.058, 0.003);

  }

  if (animal == 1) {

    // Human: upright torso, round head, two counter-swinging arms and legs.

    if (j == 0) { return vec3f(0.0, -0.103, 0.033); }

    if (j == 1) { return vec3f(0.0, -0.145, 0.027); }

    if (j == 2) { return vec3f(0.0, -0.178, 0.022); }

    if (j == 3) { return vec3f(0.003, -0.207, 0.026); }

    if (j == 4) { return vec3f(0.005, -0.244, 0.037); }

    if (j == 5) { return vec3f(0.038, -0.246, 0.010); }

    if (j == 6) { return vec3f(0.059, -0.234, 0.007); }

    if (j == 7) { return vec3f(0.044, -0.225, 0.007); }

    if (j >= 8 && j < 20) {

      let limb = (j - 8) / 3;

      let part = (j - 8) % 3;

      let wave = select(s, -s, limb % 2 == 1);

      let lift = max(0.0, select(c, -c, limb % 2 == 1));

      if (limb < 2) {

        if (part == 0) { return vec3f(-0.012 + f32(limb) * 0.024, 0.080, 0.030); }

        if (part == 1) { return vec3f(wave * 0.047 - 0.012, 0.184 - lift * 0.021, 0.023); }

        return vec3f(wave * 0.103 + 0.014, 0.296 - lift * 0.051, 0.023);

      }

      if (part == 0) { return vec3f(0.0, -0.113, 0.024); }

      if (part == 1) { return vec3f(-wave * 0.065 - 0.008, -0.016, 0.019); }

      return vec3f(-wave * 0.112 + 0.018, 0.054 - abs(wave) * 0.032, 0.020);

    }

    // The animal tail folds fully into the human pelvis.

    return vec3f(-0.010, 0.046, 0.014);

  }

  if (animal == 2) {

    // Cat: horizontal spine, short muzzle, four articulated running legs.

    if (j == 0) { return vec3f(0.091, 0.016, 0.043); }

    if (j == 1) { return vec3f(0.113, -0.006, 0.034); }

    if (j == 2) { return vec3f(0.131, -0.024, 0.032); }

    if (j == 3) { return vec3f(0.146, -0.037, 0.033); }

    if (j == 4) { return vec3f(0.161, -0.040, 0.041); }

    if (j == 5) { return vec3f(0.187, -0.034, 0.021); }

    if (j == 6) { return vec3f(0.213, -0.022, 0.018); }

    if (j == 7) { return vec3f(0.217, -0.012, 0.011); }

    if (j >= 8 && j < 20) {

      let limb = (j - 8) / 3;

      let part = (j - 8) % 3;

      let g = gait + select(0.0, 3.14159265, limb % 2 == 1) + select(0.0, 1.35, limb >= 2);

      let swing = sin(g);

      let lift = max(0.0, cos(g));

      let hip = select(-0.112, 0.099, limb >= 2);

      if (part == 0) { return vec3f(hip, 0.054, 0.024); }

      if (part == 1) { return vec3f(hip + swing * 0.044 - 0.015, 0.123 - lift * 0.026, 0.016); }

      return vec3f(hip + swing * 0.080 + 0.014, 0.181 - lift * 0.067, 0.017);

    }

    if (j == 20) { return vec3f(-0.145, 0.016, 0.023); }

    if (j == 21) { return vec3f(-0.211, -0.019 + s * 0.009, 0.019); }

    if (j == 22) { return vec3f(-0.253 + c * 0.010, -0.080 + s * 0.016, 0.015); }

    return vec3f(-0.247 + c * 0.016, -0.139 + s * 0.019, 0.011);

  }

  // Fish: all walking limbs tuck into the body or become short fins.

  if (j == 0) { return vec3f(0.087, 0.0, 0.049); }

  if (j == 1) { return vec3f(0.115, 0.0, 0.046); }

  if (j == 2) { return vec3f(0.137, 0.0, 0.042); }

  if (j == 3) { return vec3f(0.155, 0.0, 0.037); }

  if (j == 4) { return vec3f(0.170, 0.0, 0.031); }

  if (j == 5) { return vec3f(0.191, 0.006, 0.016); }

  if (j == 6) { return vec3f(0.209, 0.006, 0.011); }

  if (j == 7) { return vec3f(0.215, 0.005, 0.006); }

  if (j >= 8 && j < 20) {

    let limb = (j - 8) / 3;

    let part = (j - 8) % 3;

    let root = vec2f(-0.045 + f32(limb) * 0.032, 0.020);

    if (part == 0) { return vec3f(root, 0.016); }

    if (part == 1) { return vec3f(root + vec2f(-0.018, 0.023), 0.012); }

    return vec3f(root + vec2f(-0.041 + s * 0.012, 0.044), 0.008);

  }

  if (j == 20) { return vec3f(-0.131, 0.0, 0.032); }

  if (j == 21) { return vec3f(-0.179, s * 0.012, 0.022); }

  if (j == 22) { return vec3f(-0.217 + c * 0.008, s * 0.025, 0.014); }

  return vec3f(-0.244 + c * 0.014, s * 0.038, 0.010);

}

fn labBody(animal: i32) -> vec4f {

  if (animal == 0) { return vec4f(-0.058, -0.010, 0.112, 0.073); }

  if (animal == 1) { return vec4f(0.0, -0.012, 0.051, 0.128); }

  if (animal == 2) { return vec4f(-0.015, 0.027, 0.151, 0.064); }

  return vec4f(0.003, 0.0, 0.177, 0.091);

}

fn labHeadAxes(animal: i32) -> vec2f {

  if (animal == 0) { return vec2f(0.043, 0.034); }

  if (animal == 1) { return vec2f(0.046, 0.057); }

  if (animal == 2) { return vec2f(0.051, 0.046); }

  return vec2f(0.041, 0.051);

}

fn labEllipse(p: vec2f, center: vec2f, axes: vec2f) -> f32 {

  return (length((p - center) / axes) - 1.0) * min(axes.x, axes.y);

}

fn labBone(p: vec2f, a: vec3f, b: vec3f) -> f32 {

  let ab = b.xy - a.xy;

  let h = clamp(dot(p - a.xy, ab) / max(dot(ab, ab), 0.0000001), 0.0, 1.0);

  return length(p - a.xy - ab * h) - mix(a.z, b.z, h);

}

// Signed triangle distance, including safe collapse into the torso at holds.

fn labTriangle(p: vec2f, a: vec2f, b: vec2f, c: vec2f) -> f32 {

  let e0 = b - a;

  let e1 = c - b;

  let e2 = a - c;

  let v0 = p - a;

  let v1 = p - b;

  let v2 = p - c;

  let q0 = v0 - e0 * clamp(dot(v0, e0) / max(dot(e0, e0), 0.0000001), 0.0, 1.0);

  let q1 = v1 - e1 * clamp(dot(v1, e1) / max(dot(e1, e1), 0.0000001), 0.0, 1.0);

  let q2 = v2 - e2 * clamp(dot(v2, e2) / max(dot(e2, e2), 0.0000001), 0.0, 1.0);

  let orient = select(-1.0, 1.0, e0.x * e2.y - e0.y * e2.x >= 0.0);

  let d0 = vec2f(dot(q0, q0), orient * (v0.x * e0.y - v0.y * e0.x));

  let d1 = vec2f(dot(q1, q1), orient * (v1.x * e1.y - v1.y * e1.x));

  let d2 = vec2f(dot(q2, q2), orient * (v2.x * e2.y - v2.y * e2.x));

  let d = min(min(d0, d1), d2);

  // A collapsed appendage is a segment, never zero coverage everywhere.
  let edgeDistance = sqrt(max(d.x, 0.0));
  if (abs(e0.x * e2.y - e0.y * e2.x) < 0.00000001) {
    return edgeDistance;
  }
  return edgeDistance * select(1.0, -1.0, d.y >= 0.0);

}

fn labAppendage(animal: i32, appendage: i32, vertex: i32, gait: f32) -> vec2f {

  if (animal == 2) {

    // Two genuinely pointed ears, not rounded bumps.

    if (appendage == 0) {

      if (vertex == 0) { return vec2f(0.119, -0.058); }

      if (vertex == 1) { return vec2f(0.120, -0.122); }

      return vec2f(0.159, -0.069);

    }

    if (appendage == 1) {

      if (vertex == 0) { return vec2f(0.157, -0.069); }

      if (vertex == 1) { return vec2f(0.185, -0.119); }

      return vec2f(0.199, -0.055);

    }

    return vec2f(-0.030, 0.025) + vec2f(f32(vertex) * 0.004, 0.0);

  }

  if (animal == 3) {

    let sway = sin(gait);

    if (appendage == 0) {

      if (vertex == 0) { return vec2f(-0.091, -0.056); }

      if (vertex == 1) { return vec2f(-0.028 + sway * 0.012, -0.147); }

      return vec2f(0.061, -0.065);

    }

    if (appendage == 1) {

      if (vertex == 0) { return vec2f(-0.039, 0.063); }

      if (vertex == 1) { return vec2f(-0.060 + sway * 0.015, 0.133); }

      return vec2f(0.073, 0.062);

    }

    // Broad forked tail shares its base and phase with the tail skeleton.

    let root = labJoint(3, 22, gait).xy;

    let tip = labJoint(3, 23, gait).xy;

    if (vertex == 0) { return root + vec2f(0.009, 0.0); }

    if (vertex == 1) { return tip + vec2f(-0.065, select(-0.087, 0.087, appendage == 3)); }

    return tip + vec2f(-0.026, 0.0);

  }

  // Ears / fins fold into existing material in the other species.

  let body = labBody(animal);

  return body.xy + vec2f((f32(vertex) - 1.0) * 0.008, select(-0.006, 0.006, vertex == 1));

}

@vertex fn vs_main(in: VsIn) -> VsOut {
  var out: VsOut;
  out.position = vec4f(in.pos, 0.0, 1.0);
  out.uv = in.uv;
  return out;
}

@fragment fn fs_main(@location(0) outputUv_in: vec2f) -> @location(0) vec4f {
  let time = u.frameData.x;
  let outputUv = outputUv_in;
  let dims = max(u.frameData.yz, vec2f(1.0));
  let inputDims = max(u.inputDimsData.xy, vec2f(1.0));
  let inputTexel = vec2f(1.0) / inputDims;
  let uv = outputUv;
  // texel and aspect are input-relative to match uv. Zoom fills rescale texel
  // alongside their uv redefinition below (see zoomLocal).
  let texel = inputTexel;
  let aspect = inputDims.x / max(inputDims.y, 1.0);
  let loopDuration = u.loopDuration.x;
  let pixelSize = u.pixelSize.x;
  let characterSize = u.characterSize.x;
  let morphDuration = u.morphDuration.x;
  // Time is wrapped once for both poses and gaits. Four complete gait cycles
  // per stage makes the entire motion and its velocity periodic at the seam.
  let phase = fract(time / max(loopDuration, 0.1));
  let stageTime = phase * 4.0;
  let animal = i32(floor(stageTime));
  let nextAnimal = (animal + 1) % 4;
  let stagePhase = fract(stageTime);
  let rawMorph = clamp((stagePhase - (1.0 - morphDuration)) / morphDuration, 0.0, 1.0);
  let morph = rawMorph * rawMorph * rawMorph * (rawMorph * (rawMorph * 6.0 - 15.0) + 10.0);
  let gait = phase * 100.5309649149;
  // Pixel samples use square cells, locked to the exact central anchor.
  // dims is the logical point-space extent, independent of raster scale.
  let cell = max(1.0, round(pixelSize));
  let canvasPoint = (uv - vec2f(0.5)) * dims;
  let snapped = (floor(canvasPoint / cell) + vec2f(0.5)) * cell;
  let p = snapped / (min(dims.x, dims.y) * characterSize * 0.01);
  let torso = mix(labBody(animal), labBody(nextAnimal), morph);
  var distance = labEllipse(p, torso.xy, torso.zw);
  let head = mix(labJoint(animal, 4, gait), labJoint(nextAnimal, 4, gait), morph);
  let headAxes = mix(labHeadAxes(animal), labHeadAxes(nextAnimal), morph);
  distance = min(distance, labEllipse(p, head.xy, headAxes));
  for (var k = 0; k < 4; k = k + 1) {
    let a = mix(labJoint(animal, k, gait), labJoint(nextAnimal, k, gait), morph);
    let b = mix(labJoint(animal, k + 1, gait), labJoint(nextAnimal, k + 1, gait), morph);
    distance = min(distance, labBone(p, a, b));
  }
  for (var k = 5; k < 7; k = k + 1) {
    let a = mix(labJoint(animal, k, gait), labJoint(nextAnimal, k, gait), morph);
    let b = mix(labJoint(animal, k + 1, gait), labJoint(nextAnimal, k + 1, gait), morph);
    distance = min(distance, labBone(p, a, b));
  }
  for (var limb = 0; limb < 4; limb = limb + 1) {
    for (var part = 0; part < 2; part = part + 1) {
      let k = 8 + limb * 3 + part;
      let a = mix(labJoint(animal, k, gait), labJoint(nextAnimal, k, gait), morph);
      let b = mix(labJoint(animal, k + 1, gait), labJoint(nextAnimal, k + 1, gait), morph);
      distance = min(distance, labBone(p, a, b));
    }
  }
  for (var k = 20; k < 23; k = k + 1) {
    let a = mix(labJoint(animal, k, gait), labJoint(nextAnimal, k, gait), morph);
    let b = mix(labJoint(animal, k + 1, gait), labJoint(nextAnimal, k + 1, gait), morph);
    distance = min(distance, labBone(p, a, b));
  }
  for (var k = 0; k < 4; k = k + 1) {
    let a = mix(labAppendage(animal, k, 0, gait), labAppendage(nextAnimal, k, 0, gait), morph);
    let b = mix(labAppendage(animal, k, 1, gait), labAppendage(nextAnimal, k, 1, gait), morph);
    let c = mix(labAppendage(animal, k, 2, gait), labAppendage(nextAnimal, k, 2, gait), morph);
    distance = min(distance, labTriangle(p, a, b, c));
  }
  let background = vec3f(16.0, 16.0, 16.0) / 255.0;
  let lime = vec3f(200.0, 255.0, 61.0) / 255.0;
  return vec4f(select(background, lime, distance <= 0.0), 1.0);
}
`;
    frame.state.module = device.createShaderModule({ code: wgsl });
    frame.state.pipeline = null;
    frame.state.pipelineFormat = null;
    frame.state.quad = device.createBuffer({
        size: 6 * 4 * 4,
        usage: GPUBufferUsage.VERTEX,
        mappedAtCreation: true,
    });
    new Float32Array(frame.state.quad.getMappedRange()).set([
        -1, -1, 0, 1,
        1, -1, 1, 1,
        -1, 1, 0, 0,
        -1, 1, 0, 0,
        1, -1, 1, 1,
        1, 1, 1, 0,
    ]);
    frame.state.quad.unmap();
    frame.state.uniformBuf = device.createBuffer({
        size: 96,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
}
export function render(device, frame) {
    var params = frame.params || {};
    function finiteNumber(value, fallback) {
        var num = Number(value);
        return Number.isFinite(num) ? num : fallback;
    }
    function numberParam(name, fallback) {
        return finiteNumber(params[name], fallback);
    }
    function boolParam(name, fallback) {
        if (typeof params[name] === 'boolean')
            return params[name] ? 1 : 0;
        return fallback ? 1 : 0;
    }
    function selectParam(name, count, fallbackIndex) {
        // A select is a numeric dropdown: params[name] is the chosen option's index.
        var index = Math.round(Number(params[name]));
        return Number.isFinite(index) && index >= 0 && index < count ? index : fallbackIndex;
    }
    function colorParam(name, fallback) {
        var value = params[name] || {};
        return [
            finiteNumber(value.r, fallback[0]),
            finiteNumber(value.g, fallback[1]),
            finiteNumber(value.b, fallback[2]),
            finiteNumber(value.a, fallback[3]),
        ];
    }
    function pointParam(name, fallback) {
        var value = params[name] || {};
        return [
            finiteNumber(value.x, fallback[0]),
            finiteNumber(value.y, fallback[1]),
        ];
    }
    function pointRadiusParam(name, fallback) {
        var value = params[name] || {};
        return [
            finiteNumber(value.x, fallback[0]),
            finiteNumber(value.y, fallback[1]),
            finiteNumber(value.radius, fallback[2]),
        ];
    }
    function pointPointLineParam(name, fallback) {
        var value = params[name] || {};
        return [
            finiteNumber(value.x, fallback[0]),
            finiteNumber(value.y, fallback[1]),
            finiteNumber(value.x2, fallback[2]),
            finiteNumber(value.y2, fallback[3]),
        ];
    }
    function pointAngleRadiusParam(name, fallback) {
        var value = params[name] || {};
        return [
            finiteNumber(value.x, fallback[0]),
            finiteNumber(value.y, fallback[1]),
            finiteNumber(value.radius, fallback[2]),
            finiteNumber(value.angle, fallback[3]),
        ];
    }
    function colorPointParam(name, fallback) {
        var value = params[name] || {};
        var color = value.color || {};
        return [
            finiteNumber(value.x, fallback[0]),
            finiteNumber(value.y, fallback[1]),
            0,
            0,
            finiteNumber(color.r, fallback[2]),
            finiteNumber(color.g, fallback[3]),
            finiteNumber(color.b, fallback[4]),
            finiteNumber(color.a, fallback[5]),
        ];
    }
    function gradientParam(name, fallback) {
        var value = params[name] || {};
        var stops = Array.isArray(value.stops) && value.stops.length > 0 ? value.stops : fallback;
        // Layout: 8 stop colors (rgba), then 8 positions packed 4-per-vec4, then the live count.
        var out = new Array(44).fill(0);
        var count = Math.min(stops.length, 8);
        for (var i = 0; i < count; i++) {
            var stop = stops[i] || {};
            var color = stop.color || {};
            out[i * 4] = finiteNumber(color.r, 0);
            out[i * 4 + 1] = finiteNumber(color.g, 0);
            out[i * 4 + 2] = finiteNumber(color.b, 0);
            out[i * 4 + 3] = finiteNumber(color.a, 1);
            out[32 + i] = finiteNumber(stop.position, 0);
        }
        out[40] = count;
        return out;
    }
    var output = frame.output || {};
    var renderScale = Math.max(0.001, finiteNumber(frame.renderScale, 1));
    var width = Math.max(1, finiteNumber(output.physicalWidth, finiteNumber(output.width, 1)) / renderScale);
    var height = Math.max(1, finiteNumber(output.physicalHeight, finiteNumber(output.height, 1)) / renderScale);
    var duration = Math.max(6, Math.min(28, numberParam("loopDuration", 14)));
    // frame.time is milliseconds. Wrap in JavaScript before f32 packing to
    // preserve smooth subframe precision even during long-running previews.
    var time = ((finiteNumber(frame.time, 0) * 0.001) % duration + duration) % duration;
    var inputWidth = width;
    var inputHeight = height;
    device.queue.writeBuffer(frame.state.uniformBuf, 0, new Float32Array([
        time, width, height, 0,
        inputWidth, inputHeight, 0, 0,
        duration, 0, 0, 0,
        Math.max(2, Math.min(12, Math.round(numberParam("pixelSize", 6)))), 0, 0, 0,
        Math.max(65, Math.min(120, numberParam("characterSize", 100))), 0, 0, 0,
        Math.max(0.2, Math.min(0.75, numberParam("morphDuration", 0.42))), 0, 0, 0,
    ]));
    var outputFormat = frame.output.format;
    if (frame.state.pipeline == null || frame.state.pipelineFormat !== outputFormat) {
        frame.state.pipeline = device.createRenderPipeline({
            layout: 'auto',
            vertex: {
                module: frame.state.module,
                entryPoint: 'vs_main',
                buffers: [{
                        arrayStride: 16,
                        attributes: [
                            { shaderLocation: 0, format: 'float32x2', offset: 0 },
                            { shaderLocation: 1, format: 'float32x2', offset: 8 },
                        ],
                    }],
            },
            fragment: {
                module: frame.state.module,
                entryPoint: 'fs_main',
                targets: [{ format: outputFormat }],
            },
            primitive: { topology: 'triangle-list' },
        });
        frame.state.pipelineFormat = outputFormat;
    }
    var bindGroup = device.createBindGroup({
        layout: frame.state.pipeline.getBindGroupLayout(0),
        entries: [
            { binding: 0, resource: { buffer: frame.state.uniformBuf } },
        ],
    });
    var encoder = device.createCommandEncoder();
    var pass = encoder.beginRenderPass({
        colorAttachments: [{
                view: frame.output.createView(),
                loadOp: 'clear',
                clearValue: { r: 0, g: 0, b: 0, a: 0 },
                storeOp: 'store',
            }],
    });
    pass.setPipeline(frame.state.pipeline);
    pass.setBindGroup(0, bindGroup);
    pass.setVertexBuffer(0, frame.state.quad);
    pass.draw(6);
    pass.end();
    device.queue.submit([encoder.finish()]);
}
defineProperties(Effect, {
    "loopDuration": {
        type: "number",
        label: "Loop duration",
        defaultValue: 14,
        control: "slider",
        min: 6,
        max: 28,
        step: 0.5,
        unit: "s",
    },
    "pixelSize": {
        type: "number",
        label: "Pixel size",
        defaultValue: 6,
        control: "slider",
        min: 2,
        max: 12,
        step: 1,
        unit: "px",
    },
    "characterSize": {
        type: "number",
        label: "Character size",
        defaultValue: 100,
        control: "slider",
        min: 65,
        max: 120,
        step: 1,
        unit: "%",
    },
    "morphDuration": {
        type: "number",
        label: "Morph duration",
        defaultValue: 0.42,
        control: "slider",
        min: 0.2,
        max: 0.75,
        step: 0.01,
    },
});

export const manifest = {
  "version": 2,
  "name": "8bit lab morph",
  "isAnimated": true,
  "usesMouse": false
}
