const APP_ID= '<enter-your-own-app-id>'
const CHANNEL=sessionStorage.getItem('chname')

const TOKEN=sessionStorage.getItem('token')
let UID=Number(sessionStorage.getItem('UID'))
let NAME=sessionStorage.getItem('user')

const client= AgoraRTC.createClient({mode:'rtc',codec:'vp8'})

let localTracks=[]
let remoteUsers={}


let joinAndDisplayLocalStream=async()=>{
    document.getElementById('room-name').innerText=CHANNEL


    
    client.on('user-published',handleUserJoin)
    client.on('user-left',handleUserLeft)

    try{ 
        await client.join(APP_ID,CHANNEL,TOKEN,UID)

    }catch(error){
        console.error(error)
        Window.open('/','_self')
    }


    localTracks= await AgoraRTC.createMicrophoneAndCameraTracks()

    let member=await createMem()
    



    let player= `<div class="video-container" id="user-container-${UID}">
                    <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
                    <div class="video-player " id="user-${UID}"></div>
                </div> `
    document.getElementById('video-streams').insertAdjacentHTML('beforeend',player)

    localTracks[1].play(`user-${UID}`)

    await client.publish([localTracks[0],localTracks[1]])
}

let handleUserJoin= async(user, mediaType)=>{
    remoteUsers[user.uid]=user
    await client.subscribe(user, mediaType)
    if(mediaType=='video'){
        let player=document.getElementById(`user-container-${user.uid}`)
        if(player!=null){
            player.remove()
        }
        let member=await getMem(user)

         player= `<div class="video-container" id="user-container-${user.uid}">
                    <div class="username-wrapper"><span class="user-name">${member.name}</span></div>
                    <div class="video-player " id="user-${user.uid}"></div>
                </div> `
    document.getElementById('video-streams').insertAdjacentHTML('beforeend',player)
    user.videoTrack.play(`user-${user.uid}`)
    }
    if(mediaType==='audio'){
        user.audioTrack.play()
    }
}


let handleUserLeft=async(user)=>{
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}

let leaveAndRemoveLocalStream=async()=>{
    for (let i=0; localTracks.length>i;i++){
        localTracks[i].stop()
        localTracks[i].close()
    }

    await client.leave()
    window.open('/','_self')
}

let camerabtn=async(e)=>{
    if(localTracks[1].muted){
        await localTracks[1].setMuted(false)
        e.target.style.backgroundColor='#fff'
    }else{
        await localTracks[1].setMuted(true)
        e.target.style.backgroundColor='rgb(255,80,80,1)'
    }
}

let micbtn=async(e)=>{
    if(localTracks[0].muted){
        await localTracks[0].setMuted(false)
        e.target.style.backgroundColor='#fff'
    }else{
        await localTracks[0].setMuted(true)
        e.target.style.backgroundColor='rgb(255,80,80,1)'
    }
}
let createMem=async()=>{
    let response=await fetch('/create-mem/',
    {method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify({'name':NAME,'channel_name':CHANNEL,'UID':UID}),
    })
    let member=await response.json()
    return member
}


let getMem=async(user)=>{
    let response=await fetch(`/get-mem/?UID=${user.uid}&channel_name=${CHANNEL}`)
    let member=await response.json()
    return member
}

let deleteMem = async () => {
    let response = await fetch('/delete_member/', {
        method:'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body:JSON.stringify({'name':NAME, 'channel_name':CHANNEL, 'UID':UID})
    })
    let member = await response.json()
}

window.addEventListener("beforeunload",deleteMem);



joinAndDisplayLocalStream()


document.getElementById('exit-btn').addEventListener('click',leaveAndRemoveLocalStream) 
document.getElementById('vid-btn').addEventListener('click',camerabtn) 
document.getElementById('mic-btn').addEventListener('click',micbtn) 

