import { TextureLoader } from "three";
import { GLTFLoader, FBXLoader, PLYLoader, RGBELoader, TGALoader, MeshoptDecoder } from "three-stdlib";
import { Base } from "../Base/base";
import { Component } from "./component";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { LoaderType } from "src/app/routes/standard/utiles/Loader";


interface Resource {
    name: string,
    type: LoaderType,
    path: string
}

export class AssetManager extends Component{

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
    
    constructor(base:Base , config:any={}){
        super(base)

        const resourceList = config.resources

        this.total = 0
        this.fileLoaded = null!

        this.fbxLoader = new FBXLoader()
        this.textureLoader = new TextureLoader()
        this.plyLoader = new PLYLoader()
        this.rgbeLoader = new RGBELoader();
        this.tgaLoader = new TGALoader()
  
        const gltfLoader = new GLTFLoader()
        this.gltfLoader = gltfLoader

        this.setMeshoptDecoder()
        this.setDracoLoader()

        this.load(resourceList)
    }

    // 设置draco加载器
    setDracoLoader() {
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
        this.gltfLoader?.setDRACOLoader(dracoLoader);
    }

    // 设置meshopt解码器
    setMeshoptDecoder() {
        const meshoptDecoder = MeshoptDecoder();
        this.gltfLoader?.setMeshoptDecoder(meshoptDecoder);
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

        this.fileLoaded && this.fileLoaded()


        if (this.total === this.totalSuccess + this.totalFail) {
            this.emit('ready')
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


