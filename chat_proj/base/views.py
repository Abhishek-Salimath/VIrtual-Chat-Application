from django.http import JsonResponse
from django.shortcuts import render
from agora_token_builder import RtcTokenBuilder
from django.http import JsonResponse
import random,time,json
from .models import ChannelMember
from django.views.decorators.csrf import csrf_exempt


# Create your views here.
def lobby(request):
    return render(request, 'base/lobby.html')



def room(request):
    return render(request, 'base/room.html')

def genToken(request):
    appId='1645ac159a954c769319bd954140c503'
    appCertificate='7d3045263c2148c5b0de0c274d612f17'
    channelname=request.GET['channel']
    uid=random.randint(1,230)
    expTimeSeconds=3600*24
    currentTime=time.time()
    privExpTime=currentTime+expTimeSeconds
    role=1

    token=RtcTokenBuilder.buildTokenWithUid(appId,appCertificate,channelname,uid,role,privExpTime)
    return JsonResponse({'token':token,'uid':uid},safe=False)



@csrf_exempt
def createMem(request):
    data=json.loads(request.body)
    member,created= ChannelMember.objects.get_or_create(
        name=data['name'],
        uid=data['UID'],
        channel_name=data['channel_name']
    )
    return JsonResponse({"name":data['name']},safe=False)



def getMem(request):
    uid=request.GET['UID']
    channel_name=request.GET['channel_name']
    member=ChannelMember.objects.get(
        uid=uid,
        channel_name=channel_name,
    )

    name=member.name
    return JsonResponse({"name":member.name},safe=False)
    

@csrf_exempt
def deleteMem(request):
    data = json.loads(request.body)
    member = ChannelMember.objects.get(
        name=data['name'],
        uid=data['UID'],
        channel_name=data['channel_name']
    )
    member.delete()
    return JsonResponse('Member deleted', safe=False)
