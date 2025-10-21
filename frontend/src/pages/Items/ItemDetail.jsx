import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Rating,
  Button,
  CardActions,
} from "@mui/material";
import { itemApi } from "../../api/itemApi";
import { reviewApi } from "../../api/reviewApi";
import { useLanguage } from "../../contexts/LanguageContext";
import { translations } from "../../utils/translations";
import { useParams } from "react-router-dom";
import Loading from "../../components/loading/Loading";
import NavBar from "../../components/navbar/NavBar";
import { Link } from "react-router-dom";

const ItemDetail = () => {
  const { language } = useLanguage();
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      try {
        const resItem = await itemApi.getItem(id);
        setItem(resItem.data);
        const resReview = await reviewApi.getReviewByItem(id);
        console.log("Reviews response:", resReview.data);
        setReviews(Array.isArray(resReview.data) ? resReview.data : []);
        setReviews(Array.isArray(resReview.data) ? resReview.data : []);
      } catch (err) {
        console.error(err);
        setMessage("Error fetching data: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NavBar />
      {!loading && item ? (
        <Card
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            boxShadow: "none",
          }}
        >
          <CardMedia
            component="img"
            image={item.image || "/images/no-image.jpg"}
            alt={item.name}
            sx={{ height: 200, objectFit: "cover" }}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom>
              {item.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {item.brand?.name} {" ・ "} {item.category?.name}
            </Typography>
            <Typography color="primary" sx={{ mt: 1 }}>
              {translations[language].mmk} {" ・ "} {item.price}
            </Typography>
            <Typography fontWeight={"bold"} sx={{ mt: 2 }} variant="h5">
              {translations[language].description}
            </Typography>
            <Typography sx={{ mt: 2 }} variant="body1">
              {item.description}
            </Typography>
            <Typography sx={{ mt: 2 }} variant="subtitle1">
              {translations[language].reviews}
            </Typography>
            {reviews.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                {translations[language].no_reviews || "No reviews yet."}
              </Typography>
            ) : (
              reviews.map((review) => (
                <React.Fragment key={review._id}>
                  <Typography sx={{ mt: 2 }} variant="subtitle1">
                    <q>{review.reviewText}</q> -{" "}
                    {review.user?.name || "Anonymous"}
                  </Typography>
                  <Box sx={{ mt: 1, mb: 2 }}>
                    <Rating
                      name="half-rating-read"
                      value={review.reviewRating}
                      readOnly
                      size="small"
                    />
                  </Box>
                </React.Fragment>
              ))
            )}
          </CardContent>
          <CardActions>
            <Button
              component={Link}
              to="/"
              variant="contained"
              color="secondary"
              size="small"
            >
              {translations[language].go_back_home}
            </Button>
            <Button
              component={Link}
              to={`/${item._id}/write-review`}
              variant="contained"
              color="success"
              size="small"
            >
              {translations[language].write_review}
            </Button>
            <Button variant="contained" color="primary" size="small">
              {translations[language].atc}
            </Button>
          </CardActions>
        </Card>
      ) : (
        <Loading loading={loading} />
      )}
    </Box>
  );
};

export default ItemDetail;
