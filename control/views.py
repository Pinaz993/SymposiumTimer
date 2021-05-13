from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib.auth.views import logout_then_login


@login_required(login_url='login/')
def control(request):
    return render(request, 'control/control.html')
