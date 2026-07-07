from django.db.models import Q
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from .models import Project


def searchProjects(request):
    query = request.GET.get('search_query') or ""

    projects = Project.objects.filter(
        Q(title__icontains=query) |
        Q(description__icontains=query) |
        Q(owner__name__icontains=query) |
        Q(tags__name__icontains=query)
    ).distinct()

    return projects, query


def paginateProjects(request, projects, results):
    page = request.GET.get('page')

    paginator = Paginator(projects, results)

    try:
        projects = paginator.page(page)
    except PageNotAnInteger:
        page = 1
        projects = paginator.page(page)
    except EmptyPage:
        page = paginator.num_pages
        projects = paginator.page(page)

    page = int(page)

    leftIndex = page - 4
    rightIndex = page + 5

    if leftIndex < 1:
        leftIndex = 1

    if rightIndex > paginator.num_pages:
        rightIndex = paginator.num_pages + 1

    custom_range = range(leftIndex, rightIndex)

    # FIX HERE
    return custom_range, projects