<script>
	import config from "util/config.js"
	import { BASEURL } from "util/baseip.js"
	export default {
		onLaunch: function() {
			var current_version = config.version
			console.log(config)
			this.Myrequest('update/',"GET",{version:current_version}).then((data)=>{
				console.log(data)
				if(data.code==200){
					uni.showModal({
						title:data.msg,
						content:data.detail,
						confirmText:"更新",
						cancelText:"暂不更新",
						success(res) {
							if(res.confirm){
								var dtask = plus.downloader.createDownload(BASEURL+data.url, {}, function(d, status) {
								                                // 下载完成
																console.log(d,status)
								                                if (status == 200) {
								                                    uni.showModal({
								                                        title: '下载完成，即将安装',
								                                        showCancel: false,
								                                        success: () => {
								                                            // 由于install只能安装本地的地址，所以先把下载的地址在本地找到，再调用install
								                                            plus.runtime.install(plus.io.convertLocalFileSystemURL(d.filename), {}, function() {
								                                                console.log('success');
								                                                plus.runtime.restart(); // 安装成功后重启
								                                            }, function(error) {
								                                            console.log(error.message);
								                                                uni.showToast({
								                                                    title: "安装失败",
								                                                    duration: 1500
								                                                })
								                                            })
								                                        }
								                                    })
								                                } else {
								                                    uni.showToast({
								                                        title: '更新失败',
								                                        duration: 1500
								                                    })
								                                }
								                            })
								                            dtask.start();
							}
						}
						
					})
				}
				uni.hideLoading()
			})
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>


<style>
	/*每个页面公共css */
</style>
