import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Rating,
  CardActionArea,
  TextField,
  InputAdornment,
  IconButton,
  Skeleton,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { Link } from "react-router-dom";
import NavBar from "../components/navbar/NavBar";
import { useLanguage } from "../contexts/LanguageContext";
import { translations } from "../utils/translations";
import { itemApi } from "../api/itemApi";
import { brandApi } from "../api/brandApi";
import { reviewApi } from "../api/reviewApi";
import { categoryApi } from "../api/categoryApi";
import { promotionApi } from "../api/promotionApi";

const Home = () => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    try {
      const itemRes = await itemApi.getAllItems();
      const itemsData = itemRes.data;

      const allReviews = await Promise.all(
        itemsData.map(async (item) => {
          const res = await reviewApi.getReviewByItem(item._id);
          return Array.isArray(res.data) ? res.data : [];
        })
      );

      setItems(itemsData);
      setReviews(allReviews.flat());
    } catch (err) {
      console.error(err);
      setMessage("Error fetching data: " + err.message);
    }
  };

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await brandApi.getAllBrands();
      setBrands(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Error fetching data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryApi.getAllCategories();
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Error fetching data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchBrands();
    fetchCategories();
  }, []);

  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) => item.name.toLowerCase().includes(query));
  }, [items, searchQuery]);

  const getAverageRating = (itemId) => {
    const itemReviews = reviews.filter(
      (r) => String(r.item?._id || r.item) === String(itemId)
    );
    if (itemReviews.length === 0) return 0; // no reviews
    const sum = itemReviews.reduce((acc, r) => acc + r.reviewRating, 0);
    return sum / itemReviews.length;
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NavBar />

      {/* Search Box */}
      <Box sx={{ mb: 2, p: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder={translations[language].search}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={() => setSearchQuery("")}
                  edge="end"
                >
                  <Close />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Items Grid */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {loading ? (
          <Grid container spacing={2}>
            {Array.from(new Array(6)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card>
                  <Skeleton variant="rectangular" height={140} />
                  <CardContent>
                    <Skeleton width="50%" />
                    <Skeleton width="50%" />
                    <Skeleton width="50%" />
                    <Skeleton width="50%" />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : filteredItems.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(3, 1fr)",
                md: "repeat(4, 1fr)",
                lg: "repeat(5, 1fr)",
              },
              gap: 2,
            }}
          >
            {filteredItems.map((item) => {
              const averageRating = getAverageRating(item._id);
              return (
                <Card key={item._id}>
                  <CardActionArea component={Link} to={`/${item._id}/detail`}>
                    <CardMedia
                      component="img"
                      image={item.image || "/images/no-image.jpg"}
                      alt={item.name}
                    />
                    <CardContent>
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.brand?.name} {" ・ "} {item.category?.name}
                      </Typography>
                      <Typography color="primary" sx={{ mt: 1 }}>
                        {translations[language].mmk} {" ・ "} {item.price}
                      </Typography>

                      {averageRating > 0 ? (
                        <Box sx={{ mt: 1, display: "flex", alignItems: "center" }}>
                          <Rating
                            size="small"
                            value={averageRating}
                            precision={0.5}
                            readOnly
                          />
                          <Typography sx={{ ml: 2 }} variant="caption" color="text.secondary">
                            ( {
                              reviews.filter(
                                (r) =>
                                  String(r.item?._id || r.item) ===
                                  String(item._id)
                              ).length
                            } {" "}
                            {translations[language].reviews}  ) 
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="caption" sx={{ mt: 1 }}>
                          No reviews yet
                        </Typography>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              );
            })}
          </Box>
        ) : (
          <Typography variant="h6" color="text.secondary" sx={{ mt: 3 }}>
            {message || translations[language].no_data}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Home;
