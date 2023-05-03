<template>
	<view class="content">
				<view>
					<!-- 普通弹窗 -->
					<uni-popup ref="popup" background-color="#fff">
						<view class="popup-content" :class="{ 'popup-height': type === 'left' || type === 'right' }">
									<h2 class="title">设备编号：{{curCar.id}} </h2>
									<view class="bottonList">
										<view :class="['bottonItem',curCar.power<=20?'wave':'']">
											<h1 class="data">{{curCar.power}}</h1>
											<text class="dataName">剩余电量</text>
										</view>
										<view class="bottonItem">
											<h1 class="data">20</h1>
											<text class="dataName">巡检次数</text>
										</view>
										<view class="bottonItem">
											<h1 class="data">20</h1>
											<text class="dataName">事故率</text>
										</view>
										<view class="bottonItem">
											<h1 class="data">20</h1>
											<text class="dataName">当前位置</text>		
										</view>
									</view>
									
									<view class="blist">
										
										<view class="bl" style="background-color: rgb(168 161 161);" v-if="curCar.status" @click="work(false)">
											手动巡检
										</view>
										<view class="bl" style="background-color: rgb(224, 150, 0);" v-if="curCar.status" @click="work(true)">
											自动巡检
										</view>
										<view class="bl" style="background-color: #eee;" v-if="!curCar.status">
											设备已被占用
										</view>
									</view>
								</view>
					</uni-popup>
				</view>
				<view>
					<!-- 选择路线弹窗 -->
					<uni-popup ref="popup2" background-color="#fff">
						<view class="popup-content2" :class="{ 'popup-height': type === 'left' || type === 'right' }">
							<h3>请选择巡检线路</h3>
							<view class="contain">
								<view class="lx" @click="toControllPage(1,curCar.id,'auto')">
									路线1
								</view>
								<view class="lx"  @click="toControllPage(2,curCar.id,'auto')">
									路线2
								</view>
							</view>
								
								</view>
					</uni-popup>
				</view>
				
		<view class="img">
			<image width="375" src="/static/faxian.png"/>
		</view>
		<h1 class="title">你好！{{username}}</h1>
		<h2 class="title">请选择控制设备({{carList.length}}台在线)</h2>
		<uni-card v-for="item,index in carList" :key="index" @click="popUpAndGetCar(index)">
			设备编号：{{item.id}}
			<view :class="['battery',item.power<=20?'bounce':'']">
				<view id="top"></view>
				  <view id="btm">
					  <view id="change" :style="{height:item.power+'%',backgroundColor:`rgb(${100-item.power}%,${item.power}%,0%)`}"></view>
				  </view>
			</view>
			<span class='caritem'>
				{{item.status?"空闲":"巡检中..."}}
				<span :class="['tip',!item.status?'bounce':'']" :style="{backgroundColor:item.status?'green':'red'}"></span>
			</span>
		</uni-card>
	</view>
</template>

<script >
	export default {
		data() {
			return {
				username:'',	
				carList:[{id:1,name:"小车1",status:true,power:100},{id:2,name:"小车2",status:false,power:40},{id:3,name:"小车3",status:true,power:20}],
				type:"bottom",
				curCar:{}
				
			}
		},
		onLoad(data) {
			this.getCarList()
			this.username = data.username
		},
		onShow() {
			this.getCarList()
		},
		async onPullDownRefresh(){
			await this.getCarList()
		},
		methods: {
			work(mode){
				if(this.curCar.power<=20){
					uni.showModal({
						title:"电量过低",
						content:"当前设备电量过低，确定巡检吗？",
						success: (res)=> {
								if (res.confirm) {
									if(!mode){
										// 进入手动控制页
										this.toControllPage(0,this.curCar.id,'manual')
										toControllPage
									}else {
									// 自动控制
										this.$refs.popup2.open("center")
										this.$refs.popup.close()
									}
									return 
								} else if (res.cancel) {
									console.log('用户点击取消');
									return 
								}
							}
					})
					
				}else{
					
					if(!mode){
						// 进入手动控制页
						this.toControllPage(0,this.curCar.id,'manual')
						toControllPage
					}else {
					// 自动控制
						this.$refs.popup2.open("center")
						this.$refs.popup.close()
					}
				}
			},
			popUpAndGetCar(index){
					this.curCar = this.carList[index]
					this.popup("bottom")
			},
			popup(type) {
				this.type = type
				// open 方法传入参数 等同在 uni-popup 组件上绑定 type属性
				this.$refs.popup.open(type)
			},
			arrayBufferToBase64(buffer){
				var binary = '';
				var bytes = new Uint8Array(buffer);
				var len = bytes.byteLength;
				for(let i=0;i<len;i++){
					binary += String.fromCharCode(bytes[i]);
				}
				console.log(btoa(binary))
				return btoa(binary)
			},
			async getCarList(){
				//do somethings
				this.carList = await this.Myrequest('carList/') 
			},
			toControllPage(lxid,carid,mode){
				this.$refs.popup2.close()
				uni.showLoading({
					title:"握手转发中...",
					mask:true
				})
				setTimeout(()=>{
					uni.hideLoading()
					uni.navigateTo({
						url:`/pages/control/control?id=${carid}&lxid=${lxid}&mode=${mode}`,
						animationType:"slide-in-bottom"
					})
				},1000)

			}
		}
	}
</script>

<style scoped lang="scss">
	@keyframes bounce {
		0% {
			opacity: 0;
		}
		100%{
			opacity: 1;
		}
	}
	@keyframes wave {
		0% {
			box-shadow:  #d9d2d2 0px 0px 0px 0px;
		}
		100%{
			// box-shadow:  #ebb40e 0px 0px 11px 0px;
			box-shadow:  red 0px 0px 11px 0px;
			
		}
	}
	/deep/ .uni-popup__wrapper{
		border-radius: 20rpx;
	}
	.blist{
		display: flex;
		justify-content: space-around;
		align-items: center;
		margin-bottom: 30rpx;
		.bl {
			width: 40%;
			color: white;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			background-color: royalblue;
			border-radius: 40rpx;
			}
	}
	.bottonList{
		display: flex;
		margin: 40rpx 40rpx;
	}
	.bottonItem{
		width: 25%;
		margin: 0 10rpx;
		padding: 26rpx 0;
		border-radius: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		text-align: center;
		box-shadow: #d9d2d2 0px 0px 11px 0px;
		
		}
	.bottonItem .data {
		color: rgb(224, 150, 0);
		margin-bottom: 16rpx;
		
	}
	.bounce{
		animation: .5s linear 0s infinite alternate bounce;
	}
	.wave{
		animation: .5s linear 0s infinite alternate wave;
	}
	.bottonItem .dataName{
		font-size: 28rpx;
		color:#4e4e4e
	}
	.uni-popup__wrapper{
		border-top-right-radius: 40rpx;
		border-top-left-radius: 40rpx;
	}
	
	.popup-content2{
		padding:30rpx;
		color: rgb(224, 150, 0);
		.lx {
			width: 100rpx;
			margin: 26rpx;
			height: 120rpx;
			text-align: center;
			line-height: 120rpx;
			box-shadow: #d9d2d2 0px 0px 11px 0px;
			border-radius: 20rpx;
			
		}
		.contain{
			display: flex;
			justify-content: space-around;
			align-items: center;
		}
	}
	.title {
		color: rgb(224, 150, 0);
		text-indent: 8;
		font-weight: 800;
		margin-left: 40rpx;
		margin-top: 50rpx;
	}
	.img{
	margin-top: 200rpx;
	width: 100%;
	height: 60%;
	display: flex;
	justify-content: center;
	align-items: center;
}
	.caritem {
		position: relative;
		right: 50rpx;
		float:right
	}
	.caritem .tip {
		width: 20rpx;
		height: 20rpx;
		background-color: green;
		border-radius: 50%;
		position: absolute;
		right: -40rpx;
		top: 30%;
		/* animation: bounce .3s linear infinite alternate; */
	}
.battery {
	float: right;
	display: inline-block;
	height: 60rpx;
	width: 30rpx;
	overflow: hidden;
	line-height: 60rpx;
	text-align: center;
	margin: auto;
	position: relative;
	top: -5rpx;
	transform: scale(0.6);

}

.battery #top {

border-top-left-radius: 1rpx;

border-top-right-radius: 1rpx;

border-left: 1rpx solid #444;

border-top: 1rpx solid #444;

border-right: 1rpx solid #444;

height: 3rpx;

width: 10rpx;

margin: auto;

}

.battery #btm {

border-radius: 2rpx;
border: 1rpx solid #444;
transform: rotate(180deg);
height: 44rpx;

width: 24rpx;

margin: auto;
}
.battery #btm #change{
	width: 100%;
	height: 100%;
	border-radius: 2rpx;
	background-color: green;
}
</style>
