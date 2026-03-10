const ZINES = [
  { id:1, title:"DEEMS Vol.1", subtitle:"Volume 01", color1:"#3bbfa0", color2:"#d45b3e", accent:"#e8f0d0", frontImg:F1, backImg:B1 },
  { id:2, title:"DEEMS Vol.2", subtitle:"Volume 02", color1:"#1a1a1a", color2:"#444", accent:"#ffffff", frontImg:F2, backImg:B2 },
  { id:3, title:"DEEMS Vol.3", subtitle:"Volume 03", color1:"#ff1a5c", color2:"#cc0044", accent:"#ffe0eb", frontImg:F3, backImg:B3 },
  { id:4, title:"DEEMS Vol.4", subtitle:"Volume 04", color1:"#e04020", color2:"#661a00", accent:"#ffddd4", frontImg:F4, backImg:B4 },
  { id:5, title:"DEEMS Vol.5", subtitle:"Volume 05", color1:"#d4a574", color2:"#8b4513", accent:"#f0e0d0", frontImg:F5, backImg:B5 },
  { id:6, title:"DEEMS Vol.6", subtitle:"Volume 06", color1:"#44cc88", color2:"#116644", accent:"#d4ffe8", frontImg:F6, backImg:B6 },
  { id:7, title:"DEEMS Vol.7", subtitle:"Volume 07", color1:"#2d5e2d", color2:"#1a3a1a", accent:"#d0f0d0", frontImg:F7, backImg:B7 },
  { id:8, title:"DEEMS Vol.8", subtitle:"Volume 08", color1:"#f0a030", color2:"#cc7700", accent:"#fff4d4", frontImg:F8, backImg:B8 },
  { id:9, title:"DEEMS Vol.9", subtitle:"Volume 09", color1:"#e87090", color2:"#4488aa", accent:"#f0e8f0", frontImg:F9, backImg:B9 },
];

// ==================== BREATHING BACKGROUND ====================
(function(){
  var canvas = document.getElementById('bg-canvas');
  var ctx = canvas.getContext('2d');
  var frame = 0;
  var blobs = [];
  for(var i=0;i<5;i++){
    blobs.push({
      x:Math.random(), y:Math.random(),
      vx:(Math.random()-0.5)*0.0004, vy:(Math.random()-0.5)*0.0004,
      hue:Math.random()*360, hueSpeed:(Math.random()-0.5)*0.3,
      radius:0.3+Math.random()*0.4
    });
  }
  var PX = 6;
  function resize(){ canvas.width=window.innerWidth; canvas.height=window.innerHeight; }
  resize(); window.addEventListener('resize', resize);
  function draw(){
    var w=canvas.width, h=canvas.height;
    var breath=Math.sin(frame*0.008)*0.5+0.5;
    var breathSlow=Math.sin(frame*0.003)*0.5+0.5;
    for(var b=0;b<blobs.length;b++){
      blobs[b].x+=blobs[b].vx; blobs[b].y+=blobs[b].vy; blobs[b].hue+=blobs[b].hueSpeed;
      if(blobs[b].x<-0.2||blobs[b].x>1.2) blobs[b].vx*=-1;
      if(blobs[b].y<-0.2||blobs[b].y>1.2) blobs[b].vy*=-1;
    }
    var cols=Math.ceil(w/PX), rows=Math.ceil(h/PX);
    for(var r=0;r<rows;r++){
      for(var c=0;c<cols;c++){
        var px=(c+0.5)/cols, py=(r+0.5)/rows;
        var tH=0,tS=0,tL=0,tW=0;
        for(var b=0;b<blobs.length;b++){
          var dx=px-blobs[b].x,dy=py-blobs[b].y;
          var dist=Math.sqrt(dx*dx+dy*dy);
          var rad=blobs[b].radius*(0.8+breath*0.4);
          var wt=Math.max(0,1-dist/rad), ww=wt*wt;
          tH+=blobs[b].hue*ww; tS+=(50+breathSlow*30)*ww;
          tL+=(15+breath*12)*ww; tW+=ww;
        }
        if(tW>0){tH/=tW;tS/=tW;tL/=tW;}else{tH=0;tS=0;tL=5;}
        tL=Math.max(4,tL*0.7); tS=Math.min(80,tS);
        ctx.fillStyle='hsl('+Math.round(tH%360)+','+Math.round(tS)+'%,'+Math.round(tL)+'%)';
        ctx.fillRect(c*PX,r*PX,PX,PX);
      }
    }
    ctx.fillStyle="rgba(0,0,0,0.06)";
    for(var y=0;y<h;y+=3) ctx.fillRect(0,y,w,1);
    frame++;
    requestAnimationFrame(draw);
  }
  draw();
})();

// ==================== TEXTURE HELPERS ====================
function loadImgTex(src){
  return new Promise(function(resolve){
    var img = new Image();
    img.onload = function(){
      var t = new THREE.Texture(img);
      t.needsUpdate = true;
      t.magFilter = THREE.NearestFilter;
      t.minFilter = THREE.NearestFilter;
      resolve(t);
    };
    img.src = src;
  });
}

function makeSpine(z){
  var c=document.createElement('canvas'); c.width=16; c.height=180;
  var x=c.getContext('2d');
  var g=x.createLinearGradient(0,0,0,180);
  g.addColorStop(0, z.color1); g.addColorStop(1, z.color2);
  x.fillStyle=g; x.fillRect(0,0,16,180);
  x.fillStyle="#000"; x.fillRect(0,0,16,2); x.fillRect(0,178,16,2);
  var t=new THREE.CanvasTexture(c);
  t.magFilter=THREE.NearestFilter; t.minFilter=THREE.NearestFilter;
  return t;
}

function makeEdge(){
  var c=document.createElement('canvas'); c.width=4; c.height=4;
  var x=c.getContext('2d');
  x.fillStyle="#f5f0e6"; x.fillRect(0,0,4,4);
  x.fillStyle="#ddd5c5"; x.fillRect(0,1,4,1); x.fillRect(0,3,4,1);
  var t=new THREE.CanvasTexture(c);
  t.magFilter=THREE.NearestFilter; t.minFilter=THREE.NearestFilter;
  t.wrapS=THREE.RepeatWrapping; t.wrapT=THREE.RepeatWrapping;
  t.repeat.set(8,20);
  return t;
}

// ==================== THREE.JS SCENE ====================
(async function(){
  var W = window.innerWidth, H = window.innerHeight;
  var container = document.getElementById('three-container');

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(50, W/H, 0.1, 100);
  var renderer = new THREE.WebGLRenderer({ alpha:true, antialias:false });
  renderer.setSize(W, H);
  renderer.setPixelRatio(0.4);
  container.appendChild(renderer.domElement);

  // Make canvas fill container and look pixelated
  var cvs = renderer.domElement;
  cvs.style.width = '100%';
  cvs.style.height = '100%';
  cvs.style.imageRendering = 'pixelated';

  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  var dl = new THREE.DirectionalLight(0xffffff, 0.8);
  dl.position.set(2, 4, 3); scene.add(dl);
  var rl = new THREE.DirectionalLight(0x8888ff, 0.3);
  rl.position.set(-3, 1, -2); scene.add(rl);

  // 3x3 grid
  var COLS = 3, ROWS = 3;
  var groups = [];

  function getLayout(){
    var w = window.innerWidth, h = window.innerHeight, aspect = w/h;
    var sx, sy, camZ, sc;
    if(w < 500)       { sx=1.8; sy=2.6; camZ=12; sc=0.65; }
    else if(w < 768)  { sx=2.2; sy=2.8; camZ=10; sc=0.75; }
    else if(w < 1100) { sx=2.6; sy=3.0; camZ=9;  sc=0.85; }
    else              { sx=3.0; sy=3.0; camZ=8.5; sc=1.0;  }
    if(aspect < 0.7)      { camZ += 5; sc *= 0.8; }
    else if(aspect < 1.0) { camZ += 2; }
    return { sx:sx, sy:sy, camZ:camZ, sc:sc };
  }

  function layoutZines(){
    var lay = getLayout();
    camera.position.set(0, 0, lay.camZ);
    camera.lookAt(0, 0, 0);
    for(var i = 0; i < groups.length; i++){
      var col = i % COLS, row = Math.floor(i / COLS);
      var ox = -(COLS-1) * lay.sx / 2;
      var oy = (ROWS-1) * lay.sy / 2;
      groups[i].position.x = ox + col * lay.sx;
      groups[i].position.y = oy - row * lay.sy;
      groups[i].position.z = 0;
      groups[i].scale.set(lay.sc, lay.sc, lay.sc);
    }
  }

  // Build zine meshes
  for(var i = 0; i < ZINES.length; i++){
    var z = ZINES[i];
    var group = new THREE.Group();
    var fTex = await loadImgTex(z.frontImg);
    var bTex = await loadImgTex(z.backImg);
    var mats = [
      new THREE.MeshStandardMaterial({ map: makeSpine(z) }),
      new THREE.MeshStandardMaterial({ map: makeEdge() }),
      new THREE.MeshStandardMaterial({ map: makeEdge() }),
      new THREE.MeshStandardMaterial({ map: makeEdge() }),
      new THREE.MeshStandardMaterial({ map: fTex }),
      new THREE.MeshStandardMaterial({ map: bTex }),
    ];
    var mesh = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.95, 0.12), mats);
    group.add(mesh);
    group.userData = { zine: z, index: i, rotSpeed: 0.006 + Math.random() * 0.004 };
    scene.add(group);
    groups.push(group);
  }
  layoutZines();

  // ==================== INTERACTION ====================
  // Instead of raycasting (which breaks with low pixelRatio), we project
  // each zine's 3D center to screen coords and check click proximity.
  var hoveredZine = null;
  var readerOpen = false;

  var infoPanel = document.getElementById('info-panel');
  var infoBox = document.getElementById('info-box');
  var infoTitle = document.getElementById('info-title');
  var infoSub = document.getElementById('info-sub');
  var hint = document.getElementById('hint');

  function getZineScreenBounds(group){
    var pos = new THREE.Vector3();
    group.getWorldPosition(pos);
    pos.project(camera);
    var rect = cvs.getBoundingClientRect();
    var sx = (pos.x + 1) / 2 * rect.width;
    var sy = (-pos.y + 1) / 2 * rect.height;

    // Approximate the zine's screen size from its 3D dimensions + camera
    var lay = getLayout();
    var fovRad = camera.fov * Math.PI / 180;
    var visH = 2 * Math.tan(fovRad / 2) * lay.camZ;
    var visW = visH * camera.aspect;
    var pxPerUnit = rect.width / visW;
    var zw = 1.4 * lay.sc * pxPerUnit * 0.6; // slightly generous hit area
    var zh = 1.95 * lay.sc * pxPerUnit * 0.6;
    return { cx: sx, cy: sy, hw: zw, hh: zh };
  }

  function hitTest(clientX, clientY){
    var rect = cvs.getBoundingClientRect();
    var mx = clientX - rect.left;
    var my = clientY - rect.top;
    for(var i = 0; i < groups.length; i++){
      var b = getZineScreenBounds(groups[i]);
      if(Math.abs(mx - b.cx) < b.hw && Math.abs(my - b.cy) < b.hh){
        return groups[i].userData.zine;
      }
    }
    return null;
  }

  function updateUI(){
    if(hoveredZine && !readerOpen){
      var dz = hoveredZine;
      infoPanel.classList.add('visible');
      infoBox.style.border = '2px solid ' + dz.color1;
      infoBox.style.boxShadow = '0 0 30px ' + dz.color1 + '33';
      infoTitle.textContent = dz.title;
      infoTitle.style.color = dz.accent;
      infoTitle.style.textShadow = '1px 1px 0 ' + dz.color1;
      infoSub.textContent = dz.subtitle;
      infoSub.style.color = dz.color1;
      hint.classList.remove('visible');
    } else {
      infoPanel.classList.remove('visible');
      if(!readerOpen) hint.classList.add('visible');
    }
  }

  // Use window-level events so nothing can block them
  window.addEventListener('mousemove', function(e){
    if(readerOpen) return;
    hoveredZine = hitTest(e.clientX, e.clientY);
    cvs.style.cursor = hoveredZine ? 'pointer' : 'default';
    updateUI();
  });

  window.addEventListener('click', function(e){
    if(readerOpen) return;
    var clicked = hitTest(e.clientX, e.clientY);
    if(clicked){
      openReader(clicked);
    }
  });

  // ==================== READER ====================
  var reader = document.getElementById('reader');
  var readerPageEl = document.getElementById('reader-page');
  var readerTitleEl = document.getElementById('reader-title');
  var readerCounterEl = document.getElementById('reader-counter');
  var readerPrevBtn = document.getElementById('reader-prev');
  var readerNextBtn = document.getElementById('reader-next');
  var readerCloseBtn = document.getElementById('reader-close');
  var readerPages = [];
  var readerIdx = 0;

  function openReader(zine){
    readerPages = [zine.frontImg, zine.backImg];
    // You can add interior pages here later:
    // readerPages = [zine.frontImg, zine.page1, zine.page2, ..., zine.backImg];
    readerIdx = 0;
    readerTitleEl.textContent = zine.title;
    showReaderPage();
    reader.classList.add('open');
    readerOpen = true;
    infoPanel.classList.remove('visible');
    hint.classList.remove('visible');
  }

  function showReaderPage(){
    readerPageEl.style.opacity = '0';
    readerPageEl.style.transform = 'scale(0.95)';
    setTimeout(function(){
      readerPageEl.src = readerPages[readerIdx];
      readerPageEl.onload = function(){
        readerPageEl.style.opacity = '1';
        readerPageEl.style.transform = 'scale(1)';
      };
    }, 150);
    var total = readerPages.length;
    if(total <= 2){
      var labels = ['Front Cover', 'Back Cover'];
      readerCounterEl.textContent = labels[readerIdx] || (readerIdx+1+' / '+total);
    } else {
      readerCounterEl.textContent = (readerIdx+1) + ' / ' + total;
    }
    readerPrevBtn.disabled = (readerIdx === 0);
    readerNextBtn.disabled = (readerIdx === total - 1);
  }

  readerPrevBtn.addEventListener('click', function(e){
    e.stopPropagation();
    if(readerIdx > 0){ readerIdx--; showReaderPage(); }
  });
  readerNextBtn.addEventListener('click', function(e){
    e.stopPropagation();
    if(readerIdx < readerPages.length - 1){ readerIdx++; showReaderPage(); }
  });
  readerCloseBtn.addEventListener('click', function(e){
    e.stopPropagation();
    closeReader();
  });

  // Click on dark area closes reader
  reader.addEventListener('click', function(e){
    if(e.target === reader) closeReader();
  });

  function closeReader(){
    reader.classList.remove('open');
    readerOpen = false;
    setTimeout(function(){ hint.classList.add('visible'); }, 300);
  }

  document.addEventListener('keydown', function(e){
    if(!readerOpen) return;
    if(e.key === 'Escape') closeReader();
    if(e.key === 'ArrowLeft' && readerIdx > 0){ readerIdx--; showReaderPage(); }
    if(e.key === 'ArrowRight' && readerIdx < readerPages.length-1){ readerIdx++; showReaderPage(); }
  });

  // ==================== ANIMATION ====================
  var frame = 0;
  function animate(){
    frame++;
    var lay = getLayout();
    for(var i = 0; i < groups.length; i++){
      var g = groups[i];
      var row = Math.floor(i / COLS);
      var baseY = (ROWS-1)*lay.sy/2 - row*lay.sy;
      g.position.y = baseY + Math.sin(frame*0.015 + i*1.2) * 0.12;
      g.rotation.y += g.userData.rotSpeed;
      g.rotation.x = Math.sin(frame*0.01 + i) * 0.06;
      g.rotation.z = Math.cos(frame*0.008 + i*0.7) * 0.03;
    }
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  animate();

  // ==================== RESIZE ====================
  window.addEventListener('resize', function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    cvs.style.width = '100%';
    cvs.style.height = '100%';
    layoutZines();
  });

  // Show UI
  setTimeout(function(){ document.getElementById('header').classList.add('loaded'); }, 300);
  setTimeout(function(){ hint.classList.add('visible'); }, 800);
})();
