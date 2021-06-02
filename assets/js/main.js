const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const PLAYER_STORAGE_KEY = 'MY PLAYER'
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $(".player")
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const ramdomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playList = $('.playlist')
const app = {
    currentIndex: 0,
    isPlaying: false,
    isRamdom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Mood',
            singer: '24KGoldn, Iann Dior',
            path: 'music/song1.mp3',
            image: "img/song1.jpg"
        },
        {
            name: 'Savage Love',
            singer: ' Jason Derulo',
            path: 'music/song2.mp3',
            image: 'img/song2.jpg'
        },
        {
            name: 'Kẻ Cắp Gặp Bà Già',
            singer: 'Hoàng Tùy Linh,Binz',
            path: 'music/song3.mp3',
            image: 'img/song3.jpg'
        },
        {
            name: 'Muộn rồi mà sao còn',
            singer: 'Sơn Tùng MTP',
            path: 'music/song4.mp3',
            image: 'img/song4.jpg'
        },
        {
            name: 'Mộng Mơ',
            singer: 'Masew,RedT',
            path: 'music/song5.mp3',
            image: 'img/song5.jpg'
        },
        {
            name: 'Ice Cream',
            singer: 'BackPink,Selena Gomez',
            path: 'music/Ice Cream.mp3',
            image: 'img/song6.jpg'
        },
        {
            name: 'Chuyện Rằng',
            singer: 'Thịnh Suy',
            path: 'music/Chuyen Rang - Thinh Suy.mp3',
            image: 'img/song7.jpg'
        },
        {
            name: 'XTC(Xích Thêm Chút)',
            singer: 'Tlinh,RPT MCK',
            path: 'music/XTC Xich Them Chut_ Remix - RPT Groovie.mp3',
            image: 'img/song8.jpg'
        },
        {
            name: 'Mông Mơ',
            singer: 'Masew,RedT',
            path: 'music/song5.mp3',
            image: 'img/song5.jpg'
        },
        {
            name: 'Ice Cream',
            singer: 'BackPink,Selena Gomez',
            path: 'music/Ice Cream.mp3',
            image: 'img/song6.jpg'
        },
        {
            name: 'Chuyện Rằng',
            singer: 'Thịnh Suy',
            path: 'music/Chuyen Rang - Thinh Suy.mp3',
            image: 'img/song7.jpg'
        },
        {
            name: 'XTC(Xích Thêm Chút)',
            singer: 'Tlinh,RPT MCK',
            path: 'music/XTC Xich Them Chut_ Remix - RPT Groovie.mp3',
            image: 'img/song8.jpg'
        },
    ],
    setConfig: function (key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    loadConfig: function () {
        this.isRamdom = this.config.isRamdom
        this.isRepeat = this.config.isRepeat
    },
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `
               <div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playList.innerHTML = htmls.join('')
    },
    definePropeties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    getCurrentSong: function () {
        return this.songs[this.currentIndex]
    },
    handleEvent: function () {
        const _this = this
        const cdWidth = cd.offsetWidth
        //Xử lý CD quay và dừng
        const cdThubAnimate = cdThumb.animate([
            { transform: 'rotate(360deg)' }
        ], {
            duration: 10000, //10s
            iterations: Infinity
        })
        cdThubAnimate.pause()
        //Xử lý phóng to thu nhỏ CD
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0
            cd.style.opacity = newCdWidth / cdWidth
        }
        //Xử lý khi click play
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }
        //Khi bài hát được player
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThubAnimate.play()
        }
        //Khi bài hát bi đừng
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThubAnimate.pause()

        }
        // Khi tiến đô bài hát thay đổi
        audio.ontimeupdate = function () {
            if (audio.duration) {
                const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100)
                progress.value = progressPercent
            }
        }
        //Xử lý tua bài hát
        progress.onchange = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }
        progress.onclick = function (e) {
            const seekTime = audio.duration / 100 * e.target.value
            audio.currentTime = seekTime
        }
        //Tiến bài
        nextBtn.onclick = function () {
            if (_this.isRamdom) {
                _this.playRamdomSong()
            } else {
                _this.nextsong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        //Lùi bài
        prevBtn.onclick = function () {
            if (_this.isRamdom) {
                _this.playRamdomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
        }
        //ramdom
        ramdomBtn.onclick = function () {
            _this.isRamdom = !_this.isRamdom
            _this.setConfig('isRamdom', _this.isRamdom)
            ramdomBtn.classList.toggle('active', _this.isRamdom)
        }
        //Xử lý lặp lại
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        },
            //Xử lý next song khi bài hát kết thúc
            audio.onended = function () {
                if (_this.isRepeat) {
                    audio.play()
                } else {
                    nextBtn.click()
                }
            }
        //Lắng nghe hành vi click vào play list
        playList.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (songNode || e.target.closest('.option')) {
                //xử lý khi click vào song
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                //xử lý khi click vào option
                if (e.target.closest('.option')) {

                }
            }
        }
    },
    scrollToActiveSong: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 300)
    },
    //Bài hát hiện tại
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`
        audio.src = this.currentSong.path
    },
    //Bài kế tiếp
    nextsong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    //Bài trước đó
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    //Phát ngẫu nhiên
    playRamdomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    start: function () {
        //Gán cấu hình vào ứng dụng
        this.loadConfig()
        //Định nghĩa các thuộc tính cho object
        this.definePropeties()
        //Lắng nghe / xử lý các sự kiện (DOM event)
        this.handleEvent()
        //Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()
        //Render Playlist
        this.render()
        //Hiển thi trạng thái ban đầu là active
        ramdomBtn.classList.toggle('active', this.isRamdom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    },
}
app.start()