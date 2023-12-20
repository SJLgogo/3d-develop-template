import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { NearestFilter, sRGBEncoding, TextureLoader, VideoTexture } from 'three'
import { TGALoader } from "three/examples/jsm/loaders/TGALoader";
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'

export enum LoaderType {
    FBX = 'FBX',
    GLTF = 'GLTF',
    Texture = 'Texture',
    HDR = 'hdr',
    TGA = 'tga'
}

interface Resource {
    name: string,
    type: LoaderType,
    path: string
}

export default class Loader {

    resources: { [key: string]: any } = {}; // 加载的模型资源
    total: number;
    totalSuccess: number = 0
    totalFail: number = 0
    declare loadEnd: (resources: { [key: string]: any }) => void
    declare fileLoaded: () => void

    private declare gltfLoader: GLTFLoader
    private declare fbxLoader: FBXLoader
    private declare textureLoader: TextureLoader
    private declare plyLoader: PLYLoader
    private declare rgbeLoader: RGBELoader
    private declare tgaLoader: TGALoader

    constructor() {
        this.total = 0
        this.fileLoaded = null!

        this.fbxLoader = new FBXLoader()
        this.textureLoader = new TextureLoader()
        this.plyLoader = new PLYLoader()
        this.rgbeLoader = new RGBELoader();
        this.tgaLoader = new TGALoader()


        const dracoLoader = new DRACOLoader()  // 压缩3D模型Loader
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
        const gltfLoader = new GLTFLoader()
        gltfLoader.setDRACOLoader(dracoLoader)
        this.gltfLoader = gltfLoader
    }

    onFileLoaded(callback: () => any) {
        this.fileLoaded = callback
    }

    onLoadEnd(callback: (resources: any) => void) {
        this.loadEnd = callback
    }

    load(resources: Resource[]) {
        this.total += resources.length

        for (let resource of resources) {
            this.loadResource(resource)
        }
    }

    private loadResource(resource: Resource) {
        const type = resource.type

        let loader: GLTFLoader | FBXLoader | TextureLoader | PLYLoader;

        switch (type) {
            case LoaderType.FBX:
                loader = this.fbxLoader
                break
            case LoaderType.GLTF:
                loader = this.gltfLoader
                break
            case LoaderType.HDR:
                loader = this.rgbeLoader
                break
            case LoaderType.TGA:
                loader = this.tgaLoader
                break
            default:
                loader = this.textureLoader
        }

        loader.load(
            resource.path,
            (res: any) => { this.loadSuccess(resource, res) },
            undefined,
            res => { this.loadFail(resource, res) }
        )
    }

    private loadSuccess(resource: Resource, res: any) {
        this.totalSuccess++
        this.resources[resource.name] = res

        if (resource.name == 'man-walk-animation') {
            this.resources[resource.name] = res.animations[0]
        }

        if (resource.name == 'man') {
            this.resources['man-stand-animation'] = res.animations[0]
        }

        this.fileLoaded && this.fileLoaded()

        if (this.total === this.totalSuccess + this.totalFail) {
            this.loadEnd && this.loadEnd(this.resources)
        }
    }

    private loadFail(resource: Resource, res: any) {
        console.log('模型加载失败:', res);

        this.totalFail++
        if (this.total === this.totalSuccess + this.totalFail) {
            this.loadEnd && this.loadEnd(this.resources)
        }
    }
}