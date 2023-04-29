<template>
	<view>
		{{mode? '手动':'自动'}}控制中...
		<view class="controller">
			<view v-if="mode" >
				<view class="button" @touchstart="forward(true)" @touchend="forward(false)">
					<button type="default">👆</button>
				</view>
				<view class="button" @touchstart="back(true)" @touchend="back(false)">
					<button type="default">👇</button>
				</view>
				<view class="button" @touchstart="left(true)" @touchend="left(false)">
					<button type="default">👈🏻</button>
				</view>
				<view class="button" @touchstart="right(true)" @touchend="right(false)">
					<button type="default">👉🏻</button>
				</view>
			</view>
			<button type="primary" @click="mode=!mode">切换模式</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				mode:true,
				socketTsk:null
			}
		},
		methods: {
			 forward(type){
				if(type){
					this.socketTsk.send({
						data:'前进开始'
					})
				}else{
					this.socketTsk.send({
						data:'前进停止'
					})
				}
			},
			back(type){
				 if(type){
				 	this.socketTsk.send({
				 		data:'后退开始'
	
				 	})
				 }else{
				 	this.socketTsk.send({
				 		data:'后退停止'

				 	})
				 }
			},
			left(type){
				if(type){
					this.socketTsk.send({
						data:'向左开始'

					})
				}else{
					this.socketTsk.send({
						data:'向左停止',

					})
				}
			},
			right(type){
				if(type){
					this.socketTsk.send({
						data:'向右开始',
					})
				}else{
					this.socketTsk.send({
						data:'向右停止',
					})
				}
			}
		},
		onLoad(data) {
			console.log(data);
			// 连接websocket服务
			this.socketTsk = uni.connectSocket({
				url:`ws://192.168.1.105:8008/room/${data.id}/dev`,
				header: {
						'content-type': 'application/json'
					},
				protocols:['protocol1'],
				method: 'GET',
				data(){
					return {
						devType:1
						}
					},
				success() {
					console.log("websocket链接成功")
				}
			})
			
			this.socketTsk.onMessage((data)=>{
				console.log("收到服务端的推送",data);
				if(data.data == "小车已经离线"){
					uni.showToast({
						title:data.data,
						icon:"error",
						duration:2000
					})
					setTimeout(uni.navigateBack,2000)
					
				}
			})
		}
	}
</script>

<style scoped>
.controller {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

</style>
