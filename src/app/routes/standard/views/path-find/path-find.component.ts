import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MqttUserParams } from '../../Elements/Users';
import { tapable } from '../../utiles/Tapable';
import Loader from '../../utiles/Loader';
import configResources from '../../config/resources'
import { gsap } from 'gsap'
import World from '../Elements/World';

@Component({
  selector: 'app-path-find',
  templateUrl: './path-find.component.html',
  styleUrls: ['./path-find.component.less']
})
export class PathFindComponent implements OnInit {
  constructor(
    private http: HttpClient
  ) { }



  declare world: World;
  loader = new Loader()
  percentNum: number = 0

  allAreasOnLoadEndFn: (crowdList: number[][]) => void = (crowdList) => {
    this.world.isReady && this.world.batchCreationCrowd(crowdList)
  }

  receiveUser(params: MqttUserParams): void {
    this.world.isReady && this.world.receiveUserMqtt(params)
  }

  ngOnInit(): void {
    this.init()
    tapable._hooks.userHook.tap('人员分布', (params: MqttUserParams) => this.receiveUser(params))


    setTimeout(() => {
      tapable._hooks.userHook.call({ userId: '1', coordinate: [20, 0, -2] },)
    }, 1000)
  }

  init(): void {
    const config = {
      width: document.querySelector('.container')!.clientWidth,
      height: document.querySelector('.container')!.clientHeight,
      canvas: document.createElement('canvas'),
      element: document.querySelector('.container'),
    }
    this.world = new World(config)

    this.loader.load(configResources)

    this.loader.onFileLoaded(() => {

      const value = this.loader.totalSuccess / this.loader.total * 100

      this.percentNum = Math.round(value)
    })

    this.loader.onLoadEnd(resources => {
      gsap.to('.loading', {

        opacity: 0, onComplete: () => {

          this.world.build(resources)

          Promise.all([this.getAllCrowdAreas()])

        }

      })

    })
  }


  // 所有区域
  getAllCrowdAreas(): void {
    this.http.get('assets/station.json').subscribe((res: any) => {
      const result: number[][] = res.result.filter((i: number[]) => i[2] > 0)
      this.allAreasOnLoadEndFn(result)
    })
  }


  ngOnDestroy(): void {
    this.world.destory()
  }



}

