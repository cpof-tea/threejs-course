import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
const matcapMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture })

const fontLoader = new FontLoader()
fontLoader.load(
	'/fonts/helvetiker_regular.typeface.json',
	(font) => {
		const textGeometry = new TextGeometry(
			'Hello, friend!',
			{
				font,
				size: 0.5,
				height: 0.2,
				curveSegments: 4,
				bevelEnabled: true,
				bevelThickness: 0.03,
				bevelSize: 0.02,
				bevelOffset: 0,
				bevelSegments: 4,
			}
		)
		textGeometry.computeBoundingBox()
		textGeometry.center()

		const textMesh = new THREE.Mesh(textGeometry, matcapMaterial)
		scene.add(textMesh)
	}
)

console.time('toruses')
const torusGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45)

for (let i = 0; i < 100; i++) {
	const torusMesh = new THREE.Mesh(torusGeometry, matcapMaterial)

	torusMesh.position.x = (Math.random() - 0.5) * 10
	torusMesh.position.y = (Math.random() - 0.5) * 10
	torusMesh.position.z = (Math.random() - 0.5) * 10
	torusMesh.rotation.x = (Math.random() - 0.5) * Math.PI
	torusMesh.rotation.y = (Math.random() - 0.5) * Math.PI

	const scaleFactor = Math.random()

	torusMesh.scale.set(scaleFactor, scaleFactor, scaleFactor)

	scene.add(torusMesh)
}

console.timeEnd('toruses')
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
