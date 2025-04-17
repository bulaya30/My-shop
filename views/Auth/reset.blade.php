@extends('layouts.app')

@section('content')
<div class="container">
    <section class="section min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <div class="container">
          <div class="row justify-content-end">
            <div class="col-lg-4 col-md-6 col-sm-8 d-flex flex-column align-items-center justify-content-center">
              <div class="card mb-3 shadow">
                <div class="card-body">
                  <div class="pt-4 pb-2 mb-3">
                    <h5 class="card-title text-center pb-0 fs-4 fw-bold">Reset</h5>
                  </div>
                  <form class="row g-3 needs-validation reset-form" novalidate>
                    <div class="col-12">
                      <label for="npwd">New Password</label>
                      <input type="password" name="npwd" class="" id="npwd" placeholder="">
                      <div class="invalid-feedback">Please enter a valid Email Address!</div>
                    </div>

                    <div class="col-12">
                      <label for="password">Confirm </label>
                      <input type="password" name="cpwd" class="" id="cpwd" placeholder="">
                        <div class="invalid-feedback">Please enter your password!</div>
                    </div>
                    <div class="col-12">
                      <button class="btn btn-sm w-100" type="submit">Reset</button>
                    </div>
                  </form>

                </div>
              </div>
            </div>
          </div>
        </div>

    </section>
</div>
@endsection
