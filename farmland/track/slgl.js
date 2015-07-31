(function(){
var gl, shaderProgram, vShaderCode="", fShaderCode="", models=[];

var slgl = {
    gl: null,
    program: null,
    init: function(canvas){
        gl = slgl.gl = canvas.getContext("experimental-webgl");
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);
        gl.clearColor(0.0, 0.0, 0.0, 0.5);
        gl.clearDepth(1.0);
        gl.viewport(0, 0, canvas.width, canvas.height);
  
        initTexture();
        initShader();
        models.forEach(initBuffer);
    },
    draw: function(pMatrix){
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(shaderProgram);
        
        pMatrix&&pMatrixUniforms(pMatrix);
        models.forEach(drawElements);
        
        gl.flush();
    },
    addModel: function(m, tex, vMatrix, mMatrix, ambient){
        var vertices=[], normals=[], indexs=[], textures=[], img,
            plen=0, vlen=0,
            key, v, n, t, ind, ind2, j, len, mData;
        
        for (key in m){
            v=m[key]["vertices"], n=m[key]["normals"], t=m[key]["textures"], ind=m[key]["indexs"];
            vertices=vertices.concat(v);
            normals=normals.concat(n);
            textures=textures.concat(t);
            ind2=[];
            len=ind.length;
            for (j=0; j<len; j++){
                ind2.push(ind[j]+vlen);
            }
            indexs=indexs.concat(ind2);
            vlen = vertices.length/3;
        }
        img = tex;
        plen=indexs.length;
        mData = {
            vertices: vertices,
            normals: normals,
            textures: textures,
            indexs: indexs,
            img: img,
            plen: plen,
            vMatrix: vMatrix,
            mMatrix: mMatrix,
            ambient: ambient
        };
        models.push(mData);
        return mData;
    },
    removeModel: function(mData){
        var index = models.indexOf(mData);
        if (index >=0){
            models.splice(index, 1);
        }
    },
    addShader: function(v, f){
        vShaderCode+=v;
        fShaderCode+=f;
    },
    reset: function(){
        models.length = 0;
    }
};

function loadShader(type, code){
    var shader = gl.createShader(type);
      
    gl.shaderSource(shader, code);
    gl.compileShader(shader);
      
    return shader;
}

function initShader(){
    var vertexShader = loadShader(gl.VERTEX_SHADER, vShaderCode),
        fragmentShader = loadShader(gl.FRAGMENT_SHADER, fShaderCode);
        
    shaderProgram = slgl.program = gl.createProgram();
      
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    
    shaderProgram.gPosition = gl.getAttribLocation(shaderProgram, "gPosition");
    shaderProgram.gNormal = gl.getAttribLocation(shaderProgram, "gNormal");
    shaderProgram.gTexture = gl.getAttribLocation(shaderProgram, "gTexture");
    shaderProgram.gSampler = gl.getUniformLocation(shaderProgram, "gSampler");
    shaderProgram.vMatrix = gl.getUniformLocation(shaderProgram, "vMatrix");
    shaderProgram.mMatrix = gl.getUniformLocation(shaderProgram, "mMatrix");
    shaderProgram.nMatrix = gl.getUniformLocation(shaderProgram, "nMatrix");
    shaderProgram.ambientColor = gl.getUniformLocation(shaderProgram, "ambientColor");
}

function initBuffer(m){
    var pBuffer, nBuffer, tBuffer, indexBuffer;
    
    pBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(m["vertices"]), gl.STATIC_DRAW);
    m["pBuffer"] = pBuffer;
    
    nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(m["normals"]), gl.STATIC_DRAW);
    m["nBuffer"] = nBuffer;
    
    tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(m["textures"]), gl.STATIC_DRAW);
    m["tBuffer"] = tBuffer;
  
    indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(m["indexs"]), gl.STATIC_DRAW);
    m["indexBuffer"] = indexBuffer;
}

function initTexture(){
    var key, texture, imgs=resources["textures"];
    for (key in imgs){
        texture = gl.createTexture();
        texture.image = imgs[key]["imgObj"];
        imgs[key]["gTexture"] = texture;
        doLoadImageTexture(key);
    }
}

function doLoadImageTexture(key){
    var imgs=resources["textures"], texture = imgs[key]["gTexture"], image = texture.image, texType = imgs[key]["texType"];
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl[texType]);   //CLAMP_TO_EDGE, REPEAT, MIRRORED_REPEAT
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl[texType]);
    gl.bindTexture(gl.TEXTURE_2D, null);
}

function drawElements(m){
    gl.enableVertexAttribArray(shaderProgram.gPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, m["pBuffer"]);
    gl.vertexAttribPointer(shaderProgram.gPosition, 3, gl.FLOAT, gl.FALSE, 0, 0);
    
    gl.enableVertexAttribArray(shaderProgram.gNormal);
    gl.bindBuffer(gl.ARRAY_BUFFER, m["nBuffer"]);
    gl.vertexAttribPointer(shaderProgram.gNormal, 3, gl.FLOAT, gl.FALSE, 0, 0);
    
    gl.enableVertexAttribArray(shaderProgram.gTexture);
    gl.bindBuffer(gl.ARRAY_BUFFER, m["tBuffer"]);
    gl.vertexAttribPointer(shaderProgram.gTexture, 2, gl.FLOAT, gl.FALSE, 0, 0);
    gl.enable(gl.TEXTURE_2D);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, m["img"]["gTexture"]);
    gl.uniform1i(shaderProgram.gSampler, 0);
    gl.uniform1i(shaderProgram.gUseTexture, true);
    
    setMatrixUniforms(m["vMatrix"], m["mMatrix"]);
    gl.uniform3f(shaderProgram.ambientColor, m["ambient"][0], m["ambient"][1], m["ambient"][2]);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, m["indexBuffer"]);
    gl.drawElements(gl.TRIANGLES, m["plen"], gl.UNSIGNED_SHORT, 0);
       
}
            
function pMatrixUniforms(pMatrix) {
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "pMatrix"), false, pMatrix.toArray());
}
            
function setMatrixUniforms(vMatrix, mMatrix) {
    gl.uniformMatrix4fv(shaderProgram.vMatrix, false, vMatrix.toArray());
    gl.uniformMatrix4fv(shaderProgram.mMatrix, false, mMatrix.toArray());
    gl.uniformMatrix4fv(shaderProgram.nMatrix, false, mMatrix.inverse().transpose().toArray());
}


window.slgl = slgl;
})();