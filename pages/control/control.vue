<template>
	<view class="root">
		<view>
			<!-- <view class="_system_status_bar"></view> -->
			<!-- 提示信息弹窗 -->
			<!-- <h1 class="title">设备编号{{carInfo.id}}</h1> -->
				<view>
					<uni-popup ref="popup2" type="bottom" background-color="rgba(255,255,255)">
						<view class="popup2">
						<uni-forms class="forms" ref="baseForm" :modelValue="baseFormData">
											<uni-forms-item label="巡检设备" required>
												<uni-easyinput v-model="baseFormData.equName" placeholder="请输入巡检设备" />
											</uni-forms-item>
							
											<uni-forms-item label="巡检内容">
												<uni-easyinput type="textarea" v-model="baseFormData.detail" placeholder="请输入巡检内容" />
											</uni-forms-item>
											
																<uni-forms-item label="状态" required>
																	<uni-data-checkbox v-model="baseFormData.state" :localdata="state" />
																</uni-forms-item>
											<button type="primary" @click="submiteForm">提交</button>
										</uni-forms>
						</view>
					</uni-popup>
				</view>
			<uni-nav-bar :left-text="'编号：'+carInfo.id" color="white" statusBar :background-color="!mode?manualColor:autoColor" :title="(mode?'自动':'手动')+'巡检中'"></uni-nav-bar>

			<uni-popup class="popup" ref="message" type="message">
				<uni-popup-message :type="msgType" :message="messageText" :duration="2000"></uni-popup-message>
			</uni-popup>
		</view>
		
		<!-- {{mode? '手动':'自动'}}控制中... -->
		<!-- <video autoplay muted loop poster="/static/IMG.jpg"  src="" title="实时画面" :is-live="true"></video> -->
		<img style="width: 100%;" src="http://192.168.43.86:81/stream" alt="">
		<view class="video_botton" :style="{'--bgc':mode?autoColor:manualColor}">
			<view class="video_botton_item">
				<h2>{{carStatus.power}}</h2>
				剩余电量
			</view>
			<view class="video_botton_item">
				<h2>{{speed}}cm/s</h2>
				
				前进速度
			</view>
			<view class="video_botton_item">
				<h2>{{uploadNum}}</h2>
				
				巡检点数
			</view>
			<view class="video_botton_item">
				<h2>G2</h2>
				
				当前位置
			</view>
		</view>
		<view class="funcs">
			<view class="controller" :style="{'--bgc':mode?autoColor:manualColor}">
				<view class="direction">
					<view class="top">
						<view class="button" @touchstart="forward(true)" @touchend="forward(false)">
							<uni-icons type="top" size="40" color="#fff"></uni-icons>
						</view>
					</view>
					<view class="lr">
						<view class="button" @touchstart="left(true)" @touchend="left(false)">
							<uni-icons type="left" size="40" color="#fff"></uni-icons>
						</view>
						<view class="button" @touchstart="right(true)" @touchend="right(false)">
							<uni-icons type="right" size="40" color="#fff"></uni-icons>
							
						</view>
					</view>
					<view class="bom">
						<view class="button" @touchstart="back(true)" @touchend="back(false)">
							<uni-icons type="bottom" size="40" color="#fff"></uni-icons>
						</view>
					</view>
				</view>
				<switch class="switch" :checked="mode" @change="mode=!mode" />
				
			</view>
			<view class="boxs">
				<view class="box" :style="{'--bgc':mode?autoColor:manualColor}">
					
				<text class="box_title">速度</text>
				 <view class="speedText">
				 	{{speed}}
				 </view>
							<view style="touch-action: none;position: relative;top:10px">
								<slider block-size="16" :value="speed" @change="speedChange"/>
							</view>
				</view>
				<view class="box" :style="{'--bgc':mode?autoColor:manualColor}">
					<view class="box_container" @click="uploadInfo">
						<text class="box_title">巡检上报</text>
						<uni-icons type="upload"  color="white" size="40"></uni-icons>
						
					</view>
					
				</view>
				<view class="box" :style="{'--bgc':mode?autoColor:manualColor}">
					<view class="box_container" @click="toStartPosition">
						<text class="box_title" >返回起点</text>
						<uni-icons type="refreshempty"  color="white" size="40"></uni-icons>
					</view>				
				</view>
				<view class="box" :style="{'--bgc':mode?autoColor:manualColor}">
					<text class="box_title">其他功能</text>
				</view>
			</view>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isConnect:false,
				mode:false,
				socketTsk:null,
				msgType:"",
				messageText:"",
				carInfo:{},
				autoColor:'rgba(255,255,255,.2)',
				manualColor:"rgba(0,0,0,.2)",
				speed:50,
				carStatus:{power:0},
				uploadNum:0,
				user:{id:'1'},
				baseFormData: {
					equName:"",
					detail:"",
					state:""
				},
				state:[
					{
						text:"正常",
						value:1
					},
					{
						text:"异常",
						value:0,
					}
				]	
			}
		},
		watch:{
			mode(newV,oldV){
				if(newV){
					console.log("切换为自动模式");
					this.socketTsk.send({
						data:"autoMode"
					})
				}else{
					this.socketTsk.send({
						data:"manualMode"
					})
				}
			}
		},
		methods: {
			async submiteForm(){
				console.log("发送表单");
				let result = await this.Myrequest('uploadLogs/',"POST",{...this.baseFormData,carid:this.carInfo.id,userid:this.user.id})
				if(result.code == 200){
					uni.showToast({
						title:result.message,
						icon:'success'
					})
					this.uploadNum+=1
					this.$refs.popup2.close()
				}else{
					uni.showToast({
						title:result.message,
						icon:'error'
					})
				}
			},
			uploadInfo(){
				this.$refs.popup2.open()
			},
			// 回到起点位置
			toStartPosition(){
				uni.showModal({
					title:"回到起点",
					content:"确定回到起点吗",
					success(confirm) {
						if(confirm.confirm){
							uni.showLoading({
								title:"正在规划路线"
							})
							setTimeout(()=>{
								uni.hideLoading()
								uni.showToast({
									title:"返回成功"
								})
							},1000)

						}
					}
				})

			},
			// 速度修改
			speedChange(e){
				this.speed = e.detail.value
				this.socketTsk.send({
					data:"设置速度"+e.detail.value
				})
			},
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
			this.user.id = data.userid
			setTimeout(()=>{
				console.log("连接检查");
				if (this.isConnect)return
				uni.hideLoading()
				this.messageToggle('error','设备连接失败')
				setTimeout(uni.navigateBack,2000,-1)
			},5000)
			uni.showLoading({
				title:"正在连接...",
				mask:true,
			})
			this.mode = data.mode=="auto"?true:false
			this.carInfo = data
			// 连接websocket服务
			let self = this
			this.socketTsk = uni.connectSocket({
				url:`ws://192.168.43.127:8090/room/${data.id}/dev/${self.user.id}`,
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
					setTimeout(uni.navigateBack,2000,-1)
				}else if(data.data == 'ok'){
					this.isConnect = true
					setTimeout(()=>{
						uni.hideLoading()
						this.messageToggle('success','设备连接成功')
					},2000,-1)
				}else if(data.data.startsWith('car:')){
						this.carStatus = JSON.parse(data.data.slice(4))
				}
			})
		},
		onUnload(){
			uni.hideLoading()
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
	.root{
		height: 100vh;
		--bgc: #39b3ff;
		transition: all 3s;
		background: linear-gradient(110.6deg, rgb(179, 157, 219) 7%, rgb(150, 159, 222) 47.7%, rgb(24, 255, 255) 100.6%);
	}
	.popup2{
		height: 100%;
		/* background-color: rgba(255,255,255,.8);
		backdrop-filter: blur(20rpx);
		border-radius: 20rpx;
		box-shadow:  white 0px 0px 10px 0px; */
	}
	/depp/ .uni-popup__wrapper{
		height: 100%;
		border-top-right-radius: 40rpx;
		border-top-left-radius: 40rpx;
	}
	.forms{
		height: 100%;
		padding: 40rpx;
	}
	.funcs{
		margin: 20rpx;
		padding: 20rpx;
		backdrop-filter: blur(30rpx);
		background-color: rgba(250, 255, 255, 0.2);
		border-radius: 20rpx;
	}
	.speedText{
		font-size: 50rpx;
		position: relative;
		top: 40rpx;
	}
/* 	/deep/ .uni-slider-thumb{
		width: 18rpx !important;
		height: 18rpx !important;
	} */
	.boxs{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		align-content: center;
		color: white;
	}
	.box{
		margin: 30rpx;
		width: 40%;
		height: 180rpx;
		text-align: center;
		position: relative;
		font-size: 26rpx;
		box-shadow:  #7c7c7c 0px 0px 10px 0px;
		border-top-left-radius: 40rpx;
		border-bottom-right-radius: 40rpx;
		/* border-radius: 20rpx; */
		background-color: var(--bgc);
		transition: all 1s;
	}
	.box_title{
		position: absolute; 
		left: 20rpx; 
		top: 16rpx;
	}
	.video_botton{
		--bgc: #39b3ff;
		height: 130rpx;
		background-color: var(--bgc);
		position: relative;
		top: -11rpx;
		border-bottom-left-radius: 80rpx;
		border-bottom-right-radius: 80rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		font-size: 26rpx;
		color: white;
		transition: all 1s;
	}
	.video_botton_item{
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
	}
	._system_status_bar{
		height: var(--status-bar-height);
	}
.controller {
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	background-color: var(--bgc);
	border-radius: 50rpx;
	transition: all 1s;
	position: relative;
	box-shadow:  #7c7c7c 0px 0px 10px 0px;
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

.box_container{
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}
video{
	width: 100%;
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
	.switch{
		position: absolute;
		right: 40rpx;
		top: 40rpx;
	}
</style>
