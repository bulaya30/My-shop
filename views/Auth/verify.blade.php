@extends('layouts.app')

@section('content')
    <div id="main" class="align-items-center justify-content-center">
        <div class="container align-items-center justify-content-center pt-3">
            <div class="row  align-items-center justify-content-center">
                <div class="col-xl-7 col-lg-8 col-md-7 col-sm-12">
                    <div class="card">
                        <div class="card-header email-verification-header mb-2">
                            <h3>{{ __('Verify your email address') }}</h3>
                        </div>

                        <div class="card-body email-verification-body">
                            @if (session('resent'))
                                <div class="alert alert-success" role="alert">
                                    {{ __('A fresh verification link has been sent to your email address.') }}
                                </div>
                            @endif

                            <p class="catrd-text d-inline">{{ __('Before proceeding, please check your email for a verification link.') }} <br>
                            {{ __('If you did not receive the email') }}, 
                            <form class="d-inline" method="POST" action="{{ route('verification.resend') }}">
                                @csrf
                                <button type="submit" class="btn btn-link p-0 m-0 ">{{ __('click here to request another') }}</button>.
                            </form>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
@endsection
