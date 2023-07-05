from django.http import HttpResponse
from django.shortcuts import render
from django.http import HttpResponse, Http404, JsonResponse

def index(request, *args, **kargs):
    return HttpResponse("<h1>Hello World</h1>")