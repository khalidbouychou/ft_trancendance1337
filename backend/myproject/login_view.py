from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User

@csrf_exempt  # Use this decorator if you want to disable CSRF protection for testing purposes.
def login_view(request):
    if request.method == 'POST':
        # Assume you receive 'username' and 'password' from the request body
        username = request.POST.get('username')
        password = request.POST.get('password')

        # Authenticate the user
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            # Log the user in
            login(request, user)
            
            # Set a cookie with the user's ID
            response = JsonResponse({'message': 'Login successful'})
            response.set_cookie('userID', user.id, max_age=7 * 24 * 60 * 60)  # Set cookie for 7 days
            return response
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)

    return JsonResponse({'error': 'Only POST method allowed'}, status=405)
