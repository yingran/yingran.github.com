(function(){
    var vShaderCode = [
        "attribute vec3 gPosition;",
        "attribute vec3 gNormal;",
        "attribute vec2 gTexture;",
        "uniform mat4 pMatrix;",
        "uniform mat4 vMatrix;",
        "uniform mat4 mMatrix;",
        "uniform mat4 nMatrix;",
        "uniform vec3 ambientColor;",
        "varying vec2 currentTexture;",
        "varying vec3 lightWeighting;",
        
        "vec3 lightDirection = vec3(0.0, 1.0, 0.0);",
        "vec3 directionalColor = vec3(0.1, 0.1, 0.1);",
        
        "void main(){",
            "gl_Position = pMatrix*vMatrix*mMatrix*vec4(gPosition, 1.0);",
            "currentTexture = gTexture;",
            
            "vec3 transformedNormal = (nMatrix*vec4(gNormal, 1.0)).xyz;",
            "float directionalLightWeighting=max(dot(transformedNormal, lightDirection), 0.0);",
            "lightWeighting = ambientColor+directionalColor*directionalLightWeighting;",
        "}"
    ].join("");
    var fShaderCode = [
        "#ifdef GL_ES",
            "precision highp float;",
        "#endif",
        
        "uniform sampler2D gSampler;",
        "varying vec2 currentTexture;",
        "varying vec3 lightWeighting;",
        "vec4 tColor;",
        "void main(){",
            "tColor = texture2D(gSampler, currentTexture);",
            "gl_FragColor = vec4(tColor.rgb*lightWeighting, tColor.a);",
        "}"
    ].join("\n");
    slgl.addShader(vShaderCode, fShaderCode);
})();
