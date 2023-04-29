<template>
	<view class="content">
		<view class="img">
			<image width="375" src="/static/faxian.png"/>
		</view>
		<h1 class="title">你好！{{username}}</h1>
		<h2 class="title">请选择控制设备({{carList.length}}台在线)</h2>
		<uni-card v-for="item,index in carList" :key="index" @click="toControllPage(item.id,item.status)">
			设备编号：{{item.id}}
			<view class="battery">
				<view id="top"></view>
				  <view id="btm">
					  <view id="change" :style="{height:item.power+'%',backgroundColor:`rgb(${100-item.power}%,${item.power}%,0%)`}"></view>
				  </view>
			</view>
			<span class='caritem'>
				{{item.status?"空闲":"巡检中..."}}
				<span class="tip" :style="{backgroundColor:item.status?'green':'red'}"></span>
			</span>
		</uni-card>
	</view>
</template>

<script >
	export default {
		data() {
			return {
				username:'',	
				carList:[{id:1,name:"小车1",status:true,power:100},{id:2,name:"小车2",status:false,power:40},{id:3,name:"小车3",status:true,power:20}]
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
			toControllPage(id,status){
				if(status){
					uni.navigateTo({
						url:`/pages/control/control?id=${id}`
					})
				}else {
					uni.showToast({title:"设备正忙碌噢...",duration:2000,icon:"error"})
					return 
				}

			}
		}
	}
</script>

<style scoped>
	.title {
		color:  rgb(224, 150, 0);
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
