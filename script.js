import * as THREE from 'three'
import * as Three from "three"
import gsap from 'gsap'
import { OrbitControls } from "three/addons";
import GUI from 'lil-gui'
import geometries from "three/src/renderers/common/Geometries";
import {SRGBColorSpace} from "three";
import * as dat from 'dat.gui'
import { FontLoader} from "three/addons";
import { TextGeometry} from "three/addons";
import {RectAreaLightHelper} from "three/addons";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';



//Scene
const scene = new THREE.Scene()

/*
Texture
 */
const textureLoader = new THREE.TextureLoader()
const particlesTexture = textureLoader.load('src/assets/textures/particles/2.png')

/*
Particles
 */
//Geometry
const particlesGeometry = new THREE.BufferGeometry()
const count = 10000

const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 15
    colors[i] = Math.random()
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions,3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors,3))


//Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.2,
    sizeAttenuation: true,
})
// particlesMaterial.color = new THREE.Color('#ff88cc')
particlesMaterial.transparent = true
particlesMaterial.vertexColors = true

// particlesMaterial.alphaTest = 0.001
// particlesMaterial.depthTest = false
particlesMaterial.depthWrite = false
particlesMaterial.blending = THREE.AdditiveBlending

particlesMaterial.alphaMap = particlesTexture

//Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles);



/*
Gui
 */
const gui = new dat.GUI({
    width:300,
    title:'debug UI',
    closeFolders: true,
})
gui.close()
// gui.hide()

window.addEventListener('keydown',() =>{
    if(event.key === `h`)
        gui.show(gui._hidden)
})

const debugObject = {}

console.log(OrbitControls)

//Cursor
const cursor = {
    x:0,
    y:0
}
window.addEventListener('mousemove',(event) => {
    cursor.x = event.clientX / sizes.width -0.5
    cursor.y = event.clientY / sizes.height -0.5
})


console.log(gsap)

//webgl画布
const canvas = document.querySelector('canvas.webgl')


//fog


/*
basic
 */





/*
Lights
 */


/*
GUI
 */



/*
sizes
 */
const sizes = {
    width:window.innerWidth,
    height:window.innerHeight
}

window.addEventListener('resize',() => {
    //画布更新
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //更新相机
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    //更新画布
    renderer.setSize(sizes.width,sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//双击进入，退出全屏
window.addEventListener('dblclick', () => {
    if(!document.fullscreenElement){
        canvas.requestFullscreen()                         //进入全屏
    }else{
        document.exitFullscreen()                          //退出全屏
        console.log('leave fullscreen')
    }
})


/*
camera
 */
const camera = new THREE.PerspectiveCamera(75,sizes.width / sizes.height,0.1,1000)
camera.position.z = 4
camera.position.y = 4
camera.position.x = 4
scene.add(camera)

//相机控制
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


/*
Render
 */
const renderer = new THREE.WebGLRenderer({
    canvas:canvas
})
renderer.setSize(sizes.width,sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.antialias = true
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap


//Clock
const clock = new THREE.Clock()

// gsap.to(cube1.position, { duration:1,delay:1,x:2 })
// gsap.to(cube1.position, { duration:1,delay:2,x:0 })


/*
Animations
 */
const tick = () =>{
    //Clock
    const elapsedTime = clock.getElapsedTime()


    // camera.lookAt(cube1.position)

    //更新控制
    controls.update()

    //Render
    renderer.render(scene,camera)

    window.requestAnimationFrame(tick)
}

tick()