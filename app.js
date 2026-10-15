(() => {
"use strict";
const $ = id => document.getElementById(id);
const sections = [...document.querySelectorAll(".section")];
const navButtons = [...document.querySelectorAll(".nav-btn")];
const nav = $("nav"), menuToggle = $("menuToggle"), toast = $("toast");
let toastTimer;
function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2600);}
function showSection(id){
 const target=$(id); if(!target)return;
 sections.forEach(s=>s.hidden=s.id!==id);
 navButtons.forEach(b=>{const active=b.dataset.target===id;b.classList.toggle("active",active);if(active)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current");});
 nav.classList.remove("open");menuToggle.setAttribute("aria-expanded","false");
 if(id!=="reconocimiento"){const frame=$("faceFrame");try{frame.contentWindow.postMessage({type:"portal-stop-camera"},"*");}catch(e){}}
 window.scrollTo({top:0,behavior:"smooth"});
}
navButtons.forEach(b=>b.addEventListener("click",()=>showSection(b.dataset.target)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>showSection(b.dataset.go)));
document.querySelectorAll("[data-copy]").forEach(b=>b.addEventListener("click",async()=>{
 try{await navigator.clipboard.writeText(b.dataset.copy);showToast("Prompt copiado al portapapeles.");}
 catch(e){const t=document.createElement("textarea");t.value=b.dataset.copy;document.body.appendChild(t);t.select();const ok=document.execCommand("copy");t.remove();showToast(ok?"Prompt copiado.":"No se pudo copiar; selecciona el texto manualmente.");}
}));
menuToggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuToggle.setAttribute("aria-expanded",String(open));});
$("backTop").addEventListener("click",()=>showSection("inicio"));
$("logo").addEventListener("error",()=>{ $("logo").alt="Logotipo no encontrado. Revisa imagenesia/imagenlogo.jpg."; $("logo").style.display="none";showToast("No se encontró el logo. Revisa imagenesia/imagenlogo.jpg.");});
const questions=[
 {q:"¿Qué debes hacer antes de entregar una respuesta generada por IA?",a:["Copiarla sin leer","Verificarla y aportar mi propio criterio","Asumir que siempre es correcta"],correct:1,why:"Correcto: comprueba la información y elabora tu propia respuesta."},
 {q:"¿Qué información conviene no introducir en herramientas públicas?",a:["Una pregunta general","Una contraseña o datos personales sensibles","El nombre de un tema escolar"],correct:1,why:"Protege contraseñas, datos personales e información confidencial."},
 {q:"¿Una IA puede cometer errores?",a:["Sí, puede equivocarse o inventar datos","No, siempre tiene razón","Solo si no tiene un nombre"],correct:0,why:"Los modelos pueden producir respuestas incorrectas; contrasta la información."}
];let qi=0;
function renderQuestion(){const q=questions[qi];$("question").textContent=q.q;$("quizResult").textContent="";document.querySelectorAll("[data-answer]").forEach((b,i)=>b.textContent=q.a[i]);}
document.querySelectorAll("[data-answer]").forEach(b=>b.addEventListener("click",()=>{const q=questions[qi];$("quizResult").textContent=Number(b.dataset.answer)===q.correct?q.why:"Inténtalo de nuevo. Piensa en la privacidad y en verificar la información.";}));
$("nextQuestion").addEventListener("click",()=>{qi=(qi+1)%questions.length;renderQuestion();});renderQuestion();
const terms=[
["Algoritmo","Conjunto de pasos o reglas para resolver una tarea."],["Aprendizaje automático","Métodos que aprenden patrones a partir de datos."],["Aprendizaje profundo","Técnicas que usan redes neuronales con varias capas."],["Datos","Información utilizada para analizar, entrenar o evaluar un sistema."],["Entrenamiento","Proceso de ajustar un modelo usando ejemplos."],["Modelo","Sistema aprendido a partir de datos que genera una salida."],["Prompt","Instrucción o contexto que se proporciona a una herramienta generativa."],["Sesgo","Tendencia sistemática que puede producir resultados desiguales o injustos."],["Token","Unidad de texto u otro contenido que un modelo procesa."],["Visión artificial","Métodos para analizar imágenes y video."],["IA generativa","IA que crea contenido como texto, imágenes, audio o código."],["Red neuronal","Modelo de unidades conectadas que ajustan parámetros al aprender."]];
function renderGlossary(){const q=$("glossarySearch").value.trim().toLocaleLowerCase("es");const matches=terms.filter(t=>t.join(" ").toLocaleLowerCase("es").includes(q));$("glossaryResults").innerHTML=matches.length?matches.map(t=>`<article class="term"><strong>${escapeHtml(t[0])}</strong><div>${escapeHtml(t[1])}</div></article>`).join(""):"<p>No se encontraron conceptos. Prueba otra palabra.</p>";}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
$("glossarySearch").addEventListener("input",renderGlossary);renderGlossary();
$("reloadFrame").addEventListener("click",()=>{const f=$("faceFrame");f.src="reconocimiento_facial/modelopwa.html";$("frameStatus").textContent="Solicitando recarga de la aplicación…";f.onload=()=>$("frameStatus").textContent="Aplicación integrada cargada.";f.onerror=()=>$("frameStatus").textContent="No se pudo cargar. Comprueba reconocimiento_facial/modelopwa.html.";});
$("openStandalone").addEventListener("click",()=>window.open("reconocimiento_facial/modelopwa.html","_blank","noopener"));
$("faceFrame").addEventListener("load",()=>{$("frameStatus").textContent="Aplicación integrada cargada. La cámara se solicita desde sus controles.";});
if("serviceWorker" in navigator && (location.protocol==="https:"||location.hostname==="localhost"||location.hostname==="127.0.0.1")){window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(()=>showToast("No se pudo registrar el modo sin conexión.")));}
})();