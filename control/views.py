from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.contrib.auth.views import logout_then_login


@login_required
def control(request):
    return render(request, 'control/control.html')


def login(request):
    if request.user.is_authenticated:
        return redirect(control)
    return render(request, 'registration/login.html')
