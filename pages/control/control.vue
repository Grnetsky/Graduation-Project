<template>
	<view>
		<view>
			<!-- 提示信息弹窗 -->
			<h1 class="title">设备编号{{carInfo.id}}</h1>
			
			<uni-popup class="popup" ref="message" type="message">
				<uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
			</uni-popup>
		</view>
		
		<!-- {{mode? '手动':'自动'}}控制中... -->
		<video src=""></video>
		<view class="controller">
			<view v-if="mode" class="direction">
				<view class="top">
					<view class="button" @touchstart="forward(true)" @touchend="forward(false)">
						<button type="default">↑</button>
					</view>
				</view>
				<view class="lr">
					<view class="button" @touchstart="left(true)" @touchend="left(false)">
						<button type="default">←</button>
					</view>
					<view class="button" @touchstart="right(true)" @touchend="right(false)">
						<button type="default">→</button>
					</view>
				</view>
				<view class="bom">
					<view class="button" @touchstart="back(true)" @touchend="back(false)">
						<button type="default">↓</button>
					</view>
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
				socketTsk:null,
				msgType:"",
				messageText:"",
				carInfo:{}
			}
		},
		methods: {
			messageToggle(type,message) {
				this.msgType = type
				this.messageText =message
				this.$refs.message.open()
			},
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
			this.carInfo = data
			// 连接websocket服务
			
			this.socketTsk = uni.connectSocket({
				url:`ws://192.168.43.127:8008/room/${data.id}/dev`,
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
				success:()=> {
					console.log("websocket链接成功")
					this.messageToggle('success','设备连接成功')
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
					this.socketTsk.close()
					setTimeout(uni.navigateBack,2000)
				}
			})
		},
		onUnload(){
			this.socketTsk.close()
			console.log("socket已经断开");
		},
		// 监听页面返回
		onBackPress(options){
			console.log("onBackPress",options);
			if(options.from === 'navigateBack')return false
			uni.showModal({
				title: '提示',
				content: '当前正在控制小车，退出则断开，是否退出',
				success: function (res) {
					if (res.confirm) {
						console.log('用户点击确定');
						this.back = true
						uni.navigateBack()						
					} else if (res.cancel) {
						console.log('用户点击取消');
						return true					
					}
				}
			});
			return true

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
.controller .lr {
	display: flex;
	justify-content: space-around;
	align-items: center;
}
.bom {
	display: flex;
	justify-content: center;
	align-items: center;
}
.top {
	display: flex;
		justify-content: center;
		align-items: center;
}

video{
	width: 100%;
	z-index: -1;
}
.popup{
	z-index: 999;
}
.title {
	color: rgb(224, 150, 0);
	text-indent: 8;
	font-weight: 800;
	margin-left: 40rpx;
}
.button {
	width: 100rpx;
}
.direction {
	width: 380rpx;
	}
</style>
