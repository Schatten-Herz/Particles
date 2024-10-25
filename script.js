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


/*
Texture
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const matcapTexture = textureLoader.load('./src/assets/textures/matcaps/8.png')

const doorColorTexture = textureLoader.load('./src/assets/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('./src/assets/textures/door/alpha.jpg')
const doorHeightTexture = textureLoader.load('./src/assets/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('./src/assets/textures/door/normal.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('./src/assets/textures/door/ambientOcclusion.jpg')
const doorMetalnessTexture = textureLoader.load('./src/assets/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('./src/assets/textures/door/roughness.jpg')
const gradientTextures = textureLoader.load('./src/assets/textures/gradients/5.jpg')
gradientTextures.minFilter = THREE.NearestFilter
gradientTextures.magFilter = THREE.NearestFilter
gradientTextures.generateMipmaps = false

const environmentMapTexture = cubeTextureLoader.load([
    './src/assets/textures/environmentMaps/1/px.jpg',
    './src/assets/textures/environmentMaps/1/nx.jpg',
    './src/assets/textures/environmentMaps/1/py.jpg',
    './src/assets/textures/environmentMaps/1/ny.jpg',
    './src/assets/textures/environmentMaps/1/pz.jpg',
    './src/assets/textures/environmentMaps/1/nz.jpg'
])

// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3
// colorTexture.wrapS = THREE.RepeatWrapping
// colorTexture.wrapT = THREE.RepeatWrapping

doorColorTexture.colorSpace = THREE.SRGBColorSpace



/*
font
 */
const fontLoader = new FontLoader

fontLoader.load(
    './src/assets/font/helvetiker_regular.typeface.json',
    (font) =>{
        const textGeometry = new TextGeometry(
            'Zheng Leyi',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                curveSegment: 12,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegment: 5
            }
        )
        textGeometry.center()

        const material = new THREE.MeshMatcapMaterial()
        material.matcap = matcapTexture
        const text = new THREE.Mesh(textGeometry,material)
        scene.add(text)

        const donutGeometry = new THREE.TorusGeometry(0.3,0.2,20,45)

        for( let i=0 ; i<1000 ; i++){
            const donut = new THREE.Mesh(donutGeometry,material)

            donut.position.x = (Math.random() - 0.5) * 15
            donut.position.y = (Math.random() - 0.5) * 15
            donut.position.z = (Math.random() - 0.5) * 15

            donut.rotation.x = Math.random() * Math.PI
            donut.rotation.y = Math.random() * Math.PI

            const scale = Math.random()
            donut.scale.set(scale,scale,scale)

            scene.add(donut)

        }

}
)



/*
Gui
 */
const gui = new dat.GUI({
    width:300,
    title:'debug UI',
    closeFolders: true,
})
// gui.close()
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

//Scene
const scene = new THREE.Scene()


/*
basic
 */
// const material = new THREE.MeshBasicMaterial()
// material.map = doorColorTexture
// material.transparent = true
// material.alphaMap = doorAlphaTexture


// const material = new THREE.MeshLambertMaterial()

// const material = new THREE.MeshPhongMaterial()
// material.shininess = 200
// material.specular = new THREE.Color(0xff0000)

// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientTextures


// material.map = doorColorTexture
// material.aoMap = doorAmbientOcclusionTexture
// material.displacementMap = doorHeightTexture
// material.displacementScale = 0.1
// material.metalnessMap = doorMetalnessTexture
// material.roughnessMap = doorRoughnessTexture
// material.normalMap = doorNormalTexture
// material.normalScale.set(0.8,0.8)
// material.alphaMap = doorAlphaTexture
// material.transparent = true


const material = new THREE.MeshStandardMaterial()
material.metalness = 0.1
material.roughness = 0.4
material.envMap = environmentMapTexture

material.side = THREE.DoubleSide

gui.add(material,'metalness').min(0).max(1).step(0.001)
gui.add(material,'roughness').min(0).max(1).step(0.001)
gui.add(material,'displacementScale').min(0).max(1).step(0.001)

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5,256,256),
    material
)
sphere.geometry.setAttribute(              //uv处理
    'uv2',
    new THREE.BufferAttribute(sphere.geometry.attributes.uv.array,2)
)

sphere.position.x = -1.5


// const plane = new THREE.Mesh(
//     new THREE.PlaneGeometry(1,1,256,256),
//     material
// )
// plane.geometry.setAttribute(              //uv处理
//     'uv2',
//     new THREE.BufferAttribute(plane.geometry.attributes.uv.array,2)
// )
//
// const torus = new THREE.Mesh(
//     new THREE.TorusGeometry(0.4,0.2,64,128),
//     material
// )
// torus.geometry.setAttribute(              //uv处理
//     'uv2',
//     new THREE.BufferAttribute(torus.geometry.attributes.uv.array,2)
// )
// torus.position.x = 1.5
// scene.add(sphere,plane,torus)


/*
Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff,0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff,50)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)


/*
GUI
 */
// const cubeTweaks = gui.addFolder('cube')
// cubeTweaks.close()
//
// cubeTweaks.add(cube1.position,'y')  //物体位置控制gui
//     .min(-3)
//     .max(3)
//     .step(0.01)
//     .name('z')
//
// cubeTweaks.add(cube1,'visible')    //物体可见性gui
//     .name('方块可见')
//
// cubeTweaks.add(cube1.material,'wireframe')
//
// cubeTweaks.addColor(debugObject,'color')        //改变颜色和同步
//     .onChange(() =>{
//         cube1.material.color.set(debugObject.color)
//     })
//
// debugObject.spin = () => {
//     gsap.to(cube1.rotation,{y:cube1.rotation.y + Math.PI * 2})
// }
// cubeTweaks.add(debugObject,'spin')
//
// debugObject.subdivision = 2
// cubeTweaks.add(debugObject,'subdivision')
//     .min(1)
//     .max(20)
//     .step(1)
//     .onFinishChange(() =>{
//         cube1.geometry.dispose()
//         cube1.geometry = new THREE.BoxGeometry(
//             1,1,1,
//             debugObject.subdivision,debugObject.subdivision,debugObject.subdivision
//         )
//     })


// const cube2 = new THREE.Mesh(
//     new THREE.BoxGeometry(1,1,1),
//     new THREE.MeshBasicMaterial({color:0xd32232})
// )
// cube2.position.x = 1
// group.add(cube2)


//axes helper
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)


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
camera.position.z = 2
camera.position.y = 2
camera.position.x = 2
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

// //Time
// let time = Date.now()

//Clock
const clock = new THREE.Clock()

// gsap.to(cube1.position, { duration:1,delay:1,x:2 })
// gsap.to(cube1.position, { duration:1,delay:2,x:0 })


/*
Animations
 */
const tick = () =>{
    // //Time
    // const currentTime = Date.now()
    // const deltaTime = currentTime - time
    // time = currentTime

    //相机动画
    // camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
    // camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
    // camera.position.y = cursor.y * 7

    //Clock
    const elapsedTime = clock.getElapsedTime()

    //物体动画
    // cube1.rotation.y = Math.sin(elapsedTime)
    // cube1.rotation.x = Math.cos(elapsedTime)
    // sphere.rotation.y = 0.2 * elapsedTime
    // plane.rotation.y = 0.2 * elapsedTime
    // torus.rotation.y = 0.2 * elapsedTime
    //
    // sphere.rotation.x = 0.15 * elapsedTime
    // plane.rotation.x = 0.15 * elapsedTime
    // torus.rotation.x = 0.15 * elapsedTime

    // camera.lookAt(cube1.position)

    //更新控制
    controls.update()

    //Render
    renderer.render(scene,camera)

    window.requestAnimationFrame(tick)
}

tick()