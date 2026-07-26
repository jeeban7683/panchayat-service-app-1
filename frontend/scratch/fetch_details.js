async function test() {
  try {
    const resReviews = await fetch('http://localhost:8080/api/reviews/provider/16');
    console.log("Reviews status:", resReviews.status);
    const textReviews = await resReviews.text();
    console.log("Reviews body:", textReviews);
  } catch(e) {
    console.error("Reviews error:", e);
  }

  try {
    const resBookings = await fetch('http://localhost:8080/api/bookings/provider/16');
    console.log("Bookings status:", resBookings.status);
    const textBookings = await resBookings.text();
    console.log("Bookings body:", textBookings);
  } catch(e) {
    console.error("Bookings error:", e);
  }
}
test();
