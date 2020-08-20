<template>
  <div>
    <b-navbar toggleable="lg" variant="light">
      <b-navbar-brand href="#">App.vue</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item-dropdown text="Examples">
            <b-dropdown-item to="/examples/animation">
              Animation.vue
            </b-dropdown-item>
            <b-dropdown-item to="/examples/dot-grid"
              >DotGrid.vue
            </b-dropdown-item>
            <b-dropdown-item to="/examples/line-grid"
              >LineGrid.vue
            </b-dropdown-item>
            <b-dropdown-item to="/examples/stick-man"
              >StickMan.vue
            </b-dropdown-item>
            <b-dropdown-item to="/examples/basic-shape">
              BasicShape.vue
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>

    <!-- route outlet -->
    <!-- component matched by the route will render here -->
    <router-view></router-view>
  </div>
</template>
