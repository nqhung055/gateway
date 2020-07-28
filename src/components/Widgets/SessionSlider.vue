<!-- Session Slider -->
<template>
  <div>
    <app-section-loader :status="loader"></app-section-loader>
    <slick :options="slickOptions" v-if="testimonials">
      <template v-for="testimonial in testimonials">
        <div class="session-slider" :key="testimonial.id">
          <div class="slider-content">
            <img :src="testimonial.avatar" class="rounded-circle img-responsive" width="170" height="170" />
            <div class="slider-meta mb-4">
              <span class="d-block client-name fw-bold">
                <i>{{testimonial.name}}</i>
              </span>
              <span class="d-block client-digg">{{testimonial.designation}}</span>
            </div>
            <p class="px-4">{{testimonial.body}}</p>
          </div>
        </div>
      </template>
    </slick>
  </div>
</template>
<script>
import Slick from "vue-slick";

export default {
  components: {
    Slick
  },
  mounted() {
    this.getTestimonials();
  },
  computed: {
    slickOptions() {
      return {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        arrows: false
      };
    }
  },
  data() {
    return {
      loader: true,
      testimonials: null
    };
  },
  methods: {
    getTestimonials() {
      this.loader = false
      this.testimonials = [
        {
          id:1,
          name:"Mia Mabanta",
          avatar:"https://reactify.theironnetwork.org/data/images/user-1.jpg",
          profile:"https://reactify.theironnetwork.org/data/images/client-1.png",
          designation:"UI Developer",
          body:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
        },
        {
          id:2,
          name:"Emmy Loren",
          avatar:"https://reactify.theironnetwork.org/data/images/user-2.jpg",
          profile:"https://reactify.theironnetwork.org/data/images/client-2.png",
          designation:"UX Developer",
          body:"Sed consequat lobortis risus, vitae congue nulla tempor id. Curabitur eu augue id nibh tristique tristique. Phasellus vel est nisi"
        },
        {
          id:3,
          name:"Astell Mercell",
          avatar:"https://reactify.theironnetwork.org/data/images/user-3.jpg",
          profile:"https://reactify.theironnetwork.org/data/images/client-3.png",
          designation:"Director of Brand Development at Quartz",
          body:"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English."
        }
      ]
    }
  }
};
</script>
